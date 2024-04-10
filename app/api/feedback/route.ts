import dbConnect from "@/server/dbConnect";
import Feedback from "@/server/model/feedback.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // connect database
    await dbConnect();

    // Destructure form data from the request body and also get author from decoded data
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Please fill in all fields" },
        { status: 400 },
      );
    }

    const feedback = await Feedback.create({
      name,
      email,
      subject,
      message,
    });

    await feedback.save();

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
