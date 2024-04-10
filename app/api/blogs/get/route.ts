// import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/server/dbConnect";
// import Admin from "@/server/model/admin.model";
import BlogNewsEvent from "@/server/model/blognewsevent.model";
// import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // connect database
    await dbConnect();

    const category = req.nextUrl.searchParams.get("category");
    const keyword = req.nextUrl.searchParams.get("keyword");
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const blog = await BlogNewsEvent.findOne({ _id: id }).populate(
        "author",
        "name avatar",
      );
      return NextResponse.json({ blog }, { status: 200 });
    }

    let query: { [key: string]: any };

    if (keyword) {
      query = {
        category: category ? category.toUpperCase() : "BLOG",
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { subtitle: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
        ],
      };
    } else {
      query = {
        category: category ? category.toUpperCase() : "BLOG",
      };
    }

    const blogs = await BlogNewsEvent.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name avatar");

    return NextResponse.json({ blogs }, { status: 200 });
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
