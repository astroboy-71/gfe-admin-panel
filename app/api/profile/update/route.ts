import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // connect database
    await dbConnect();

    // Destructure form data from the request body and also get author from decoded data
    const { email, name, password, newpassword, avatar } = await req.json();

    if (avatar) {
      const admin = await Admin.findOne({ email: session.user?.email });

      if (!admin) {
        return NextResponse.json(
          { message: "You don't have permission" },
          { status: 400 },
        );
      }

      admin.avatar = avatar;

      await admin.save();

      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (session.user?.email !== email) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Password doesn't match" },
        { status: 400 },
      );
    }

    if (name) {
      admin.name = name;
    }

    if (newpassword) {
      admin.password = bcrypt.hashSync(newpassword, 12);
    }

    await admin.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
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
