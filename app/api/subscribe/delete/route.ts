import dbConnect from "@/server/dbConnect";
import Subscriber from "@/server/model/subscriber.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // connect database
    await dbConnect();

    const { email } = await req.json();
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: "EMAIL_NOT_FOUND" },
        { status: 400 },
      );
    }

    await Subscriber.deleteOne({ email });

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
