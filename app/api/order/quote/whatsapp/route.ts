import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

import { appendValues } from "@/app/lib/google-sheets";

const SPREADSHEET_ID = "15gcN8cTRhx1o2rsJ6nHbvKCaysqlz9mbLIYleh8BMYo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gclid = body?.gclid || "";
    const url = body?.url || "";

    await appendValues({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet2",
      values: [
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          gclid,
          "",
          url,
          dayjs().add(5, "h").format("MMMM D, YYYY h:mm A"),
          true,
        ],
      ],
    });

    return NextResponse.json({
      success: true,
      message: "WhatsApp click tracked successfully",
    });
  } catch (error) {
    console.error("Error processing WhatsApp quote request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    );
  }
}
