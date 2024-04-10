import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import Users from "@/server/model/users.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      );
    }

    const session = await getServerSession(authOptions);

    // connect database
    await dbConnect();

    const admin = await Admin.findOne({
      email: session?.user?.email || "",
      role: "ADMIN",
    });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    const users = await Users.find({});

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
