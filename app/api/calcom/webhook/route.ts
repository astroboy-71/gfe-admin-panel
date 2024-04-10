import dbConnect from "@/server/dbConnect";
import Booking from "@/server/model/booking.model";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 },
      );
    }

    const payload = await req.json();

    const hash = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET || "")
      .update(JSON.stringify(payload))
      .digest("hex");

    if (hash !== req.headers.get("X-Cal-Signature-256")) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    if (payload.payload.type !== "meet-ceo-of-gfe-foundation") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await dbConnect();

    if (payload.triggerEvent === "BOOKING_CREATED") {
      const booking = await Booking.create({
        uid: payload.payload.iCalUID,
        name: payload.payload.responses.name.value,
        email: payload.payload.responses.email.value,
        start: new Date(payload.payload.startTime),
        end: new Date(payload.payload.endTime),
        status: "BOOKING_CREATED",
        link: payload.payload.metadata.videoCallUrl,
        note: payload.payload.responses.notes.value,
      });

      await booking.save();

      return NextResponse.json({ success: true }, { status: 200 });
    } else if (payload.triggerEvent === "BOOKING_RESCHEDULED") {
      const uid = payload.payload.iCalUID;
      const booking = await Booking.findOne({ uid });

      if (!booking) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 },
        );
      }

      booking.status = "BOOKING_RESCHEDULED";
      booking.start = new Date(payload.payload.startTime);
      booking.end = new Date(payload.payload.endTime);
      booking.note = payload.payload.responses.notes.value;

      await booking.save();

      return NextResponse.json({ success: true }, { status: 200 });
    } else if (payload.triggerEvent === "BOOKING_CANCELLED") {
      const uid = payload.payload.iCalUID;
      const booking = await Booking.findOne({ uid });

      if (!booking) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 },
        );
      }

      booking.status = "BOOKING_CANCELLED";

      await booking.save();

      return NextResponse.json({ success: true }, { status: 200 });
    } else if (payload.triggerEvent === "MEETING_ENDED") {
      const uid = payload.payload.iCalUID;
      const booking = await Booking.findOne({ uid });

      if (!booking) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 },
        );
      }

      booking.status = "MEETING_ENDED";

      await booking.save();

      return NextResponse.json({ success: true }, { status: 200 });
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
