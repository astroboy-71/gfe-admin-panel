import dbConnect from "@/server/dbConnect";
import Subscriber from "@/server/model/subscriber.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // connect database
    await dbConnect();

    const { email } = await req.json();

    const subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return NextResponse.json(
        { success: false, message: "EMAIL_ALREADY_SUBSCRIBED" },
        { status: 400 },
      );
    }

    await Subscriber.create({
      email,
      subscribedContents: ["BLOG", "NEWS", "EVENT"],
    });

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
