import { authOptions } from "@/lib/auth-options";
import sendmail from "@/lib/sendmail";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import BlogNewsEvent from "@/server/model/blognewsevent.model";
import Subscriber from "@/server/model/subscriber.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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

    const blog = await BlogNewsEvent.create({
      previewImage,
      title,
      subtitle,
      category,
      content,
      author: admin._id,
    });

    await blog.save();

    const subscribers = await Subscriber.find({});

    for (const subscriber of subscribers) {
      await sendmail(subscriber.email, `NEW_${category.toUpperCase()}_POST`, {
        title: title,
        summary: subtitle,
        image: previewImage,
        link: `https://gfe.foundation/blogs-and-news/${blog._id}`,
        email: subscriber.email,
      });
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
