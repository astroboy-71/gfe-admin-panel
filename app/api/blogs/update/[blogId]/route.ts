import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import BlogNewsEvent from "@/server/model/blognewsevent.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    if (req.method !== "PUT") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      );
    }

    const blogId = req.nextUrl.pathname.split("/").pop();

    const session = await getServerSession(authOptions);

    // connect database
    await dbConnect();

    // Destructure form data from the request body and also get author from decoded data
    const { title, subtitle, category, content, previewImage } =
      await req.json();

    if (!title || !subtitle || !category || !content || !previewImage) {
      return NextResponse.json(
        { message: "Please fill in all fields" },
        { status: 400 },
      );
    }

    const admin = await Admin.findOne({ email: session?.user?.email || "" });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    let query: { [key: string]: string | undefined } = {
      _id: blogId,
    };

    if (admin.role === "MODERATOR") {
      query.author = admin._id;
    }

    const blog = await BlogNewsEvent.findOne(query);

    if (!blog) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    blog.title = title;
    blog.subtitle = subtitle;
    // blog.category = category;
    blog.content = content;
    blog.previewImage = previewImage;

    await blog.save();

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
