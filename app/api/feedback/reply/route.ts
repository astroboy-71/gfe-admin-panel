import sendmail from "@/lib/sendmail";
import dbConnect from "@/server/dbConnect";
import Feedback from "@/server/model/feedback.model";
import Admin from "@/server/model/admin.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    let { id, message } = await req.json();

    await dbConnect();

    const admin = await Admin.findOne({ email: session?.user?.email || "" });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    const feedback = await Feedback.findOne({
      _id: id,
    });

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 200 },
      );
    }

    feedback.reply.push({ message, date: new Date() });

    await feedback.save();

    message = message.replace(/(\r\n|\n|\r)/gm, "<br />");

    await sendmail(feedback.email, "FEEDBACK_REPLY", { message }, "CONTACT");

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
