import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import BlogNewsEvent from "@/server/model/blognewsevent.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    if (req.method !== "DELETE") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      );
    }

    const session = await getServerSession(authOptions);

    // connect database
    await dbConnect();

    const admin = await Admin.findOne({ email: session?.user?.email || "" });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    const { id, category } = await req.json();

    const blog = await BlogNewsEvent.findOne({
      _id: id,
      category,
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 200 },
      );
    }

    await blog.deleteOne();

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
