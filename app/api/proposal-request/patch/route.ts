import { authOptions } from "@/lib/auth-options";
import sendmail from "@/lib/sendmail";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import proposalModel from "@/server/model/proposal.model";
import topicModel from "@/server/model/topic.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
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

    const { id, status } = await req.json();

    const proposalRequest = await proposalModel.findOne({
      _id: id,
    });

    if (!proposalRequest) {
      return NextResponse.json(
        { success: false, message: "Proposal Request not found" },
        { status: 200 },
      );
    }

    const topic = await topicModel
      .findById(proposalRequest.topic)
      .populate("author", "name email");

    if (!topic) {
      return NextResponse.json(
        { success: false, message: "Topic not found" },
        { status: 200 },
      );
    }

    topic.status = status;

    await topic.save();

    await sendmail(topic.author.email, status, {
      name: topic.author.name,
      title: topic.title,
      link: `https://forum.gfe.foundation/topics/${topic.slug}`,
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
