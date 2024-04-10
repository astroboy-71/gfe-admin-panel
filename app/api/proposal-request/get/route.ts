import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/server/dbConnect";
import Admin from "@/server/model/admin.model";
import proposalModel from "@/server/model/proposal.model";
import SubDAOReuqest from "@/server/model/subdaoRequest.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // connect database
    await dbConnect();

    const admin = await Admin.findOne({
      email: session?.user?.email || "",
      role: "ADMIN",
    });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission" },
        { status: 400 },
      );
    }

    const proposals = await proposalModel.aggregate([
      {
        $lookup: {
          from: "topics", // Assume this matches your Topics collection name in MongoDB, usually lowercase and plural
          localField: "topic",
          foreignField: "_id",
          as: "topic",
        },
      },
      { $unwind: "$topic" },
      { $match: { "topic.status": { $regex: "^SUBMISSION" } } },
      {
        $lookup: {
          from: "users", // Ensure this matches your Users collection name in MongoDB
          localField: "topic.author",
          foreignField: "_id",
          as: "topic.author", // This will add author details including name and email under topic.authorDetails
        },
      },
      {
        $unwind: "$topic.author", // Optional: Only if you are sure every topic has one author. Otherwise, authorDetails will be an array.
      },
    ]);

    console.log(proposals);

    return NextResponse.json({ proposals }, { status: 200 });
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
