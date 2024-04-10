import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/dbConnect";
import Users from "@/server/model/users.model";
import Admin from "@/server/model/admin.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  try {
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
    const { id } = await req.json();

    try {
      await Admin.deleteOne({ _id: id });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "User Not Found!" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
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
