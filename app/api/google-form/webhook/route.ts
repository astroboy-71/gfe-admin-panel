import dbConnect from "@/server/dbConnect";
import SubdaoRequestModel from "@/server/model/subdaoRequest.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (
      req.headers.get("X-Forms-Signature") !==
      process.env.GOOGLE_FORMS_WEBHOOK_SECRET
    ) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await dbConnect();

    const data = {
      name: payload["What is your name?"],
      email: payload["What is your mail address?"],
      location: payload["Where are you based in?"],
      phone: payload["What is your phone number"],
      bio: payload["What describes you best?"],
      subdaoLocation:
        payload["In which city or field do you want start or lead a SubDAO?"],
      deployType:
        payload["Are you going to deploy facility or only open a forum?"],
      subdaoSize:
        payload[
          "What is the current or expected size of SubDAO you are planning?"
        ],
      helpRequest: payload["What kind of help will you need with this DAO?"],
      discord: payload["Please share your discord ID"],
      linkedin: payload["Please share your Linkedin profile"],
    };

    const _subdaoRequest = await SubdaoRequestModel.findOne({
      email: data.email,
    });

    if (_subdaoRequest) {
      await SubdaoRequestModel.updateOne(
        {
          _id: _subdaoRequest._id,
        },
        data,
      );
    } else {
      await SubdaoRequestModel.create(data);
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
