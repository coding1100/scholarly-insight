import { NextRequest, NextResponse } from "next/server";
import { PhoneNumberUtil } from "google-libphonenumber";
import { getName } from "country-list";
import dayjs from "dayjs";

import clientPromise from "@/app/lib/mongodb";
import { uploadFile } from "@/app/lib/cloudinary";
import { appendValues } from "@/app/lib/google-sheets";
import { createContact } from "@/app/lib/ghl";
import { sendGetAQuoteMail } from "@/app/lib/email";

const SPREADSHEET_ID = "15gcN8cTRhx1o2rsJ6nHbvKCaysqlz9mbLIYleh8BMYo";
const GHL_LOCATION_ID = "PrmJ3qseVQyutkMwBUm7";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract fields from FormData
    const email = formData.get("email") as string | null;
    const phone_number = formData.get("phone_number") as string | null;
    const course_name = formData.get("course_name") as string | null;
    const course_level = formData.get("course_level") as string | null;
    const course_weeks = formData.get("course_weeks") as string | null;
    const course_deadline = formData.get("course_deadline") as string | null;
    const no_of_pages = formData.get("no_of_pages") as string | null;
    const instructions = formData.get("instructions") as string | null;
    const gclid = formData.get("gclid") as string | null;
    const fbclid = formData.get("fbclid") as string | null;
    const url = formData.get("url") as string | null;
    const file = formData.get("file") as File | null;

    // Validate: at least email or phone_number must be provided
    if (!email && !phone_number) {
      return NextResponse.json(
        { success: false, message: "You must include email or phone_number" },
        { status: 400 }
      );
    }

    // Upload file to Cloudinary (if provided)
    let fileUrl: string | null = null;
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await uploadFile(buffer);
        fileUrl = result?.fileUrl || null;
      } catch (error) {
        console.error("Cloudinary Service Error:", error);
        // Non-blocking: continue even if file upload fails
      }
    }

    // Parse phone number for country name
    let country_name: string | undefined;
    if (phone_number) {
      try {
        const phoneUtil = PhoneNumberUtil.getInstance();
        const phone = phoneUtil.parse(phone_number);
        if (phoneUtil.isValidNumber(phone)) {
          const regionCode = phoneUtil.getRegionCodeForNumber(phone);
          if (regionCode) {
            country_name = getName(regionCode) || undefined;
          }
        }
      } catch {
        // Ignore phone parsing errors
      }
    }

    // 1. Save to MongoDB
    const createQuotePromise = (async () => {
      try {
        const client = await clientPromise;
        const db = client.db("scholarly_help");
        await db.collection("quotes").insertOne({
          course_name: course_name || undefined,
          course_level: course_level || undefined,
          course_weeks: course_weeks || undefined,
          course_deadline: course_deadline || undefined,
          email: email || undefined,
          phone_number: phone_number || undefined,
          file: fileUrl || undefined,
          no_of_pages: no_of_pages || undefined,
          instructions: instructions || undefined,
          gclid: gclid || undefined,
          fbclid: fbclid || undefined,
          url: url || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("MongoDB insert error:", error);
      }
    })();

    // 2. Append to Google Sheets
    const appendValuesPromise = (async () => {
      try {
        await appendValues({
          spreadsheetId: SPREADSHEET_ID,
          range: "Sheet2",
          values: [
            [
              email || "",
              phone_number ? phone_number.replace("+", "") : "",
              course_level || "",
              course_name || "",
              course_weeks || "",
              course_deadline || "",
              no_of_pages || "",
              instructions || "",
              gclid || "",
              fbclid || "",
              url || "",
              dayjs().add(5, "h").format("MMMM D, YYYY h:mm A"),
            ],
          ],
        });
      } catch (error) {
        console.error("Google Sheets append error:", error);
      }
    })();

    // 3. Create GHL contact (non-blocking)
    const createGHLContactPromise = (async () => {
      try {
        await createContact({
          email: email || undefined,
          phone: phone_number || undefined,
          source: fbclid || gclid || undefined,
          locationId: GHL_LOCATION_ID,
        });
      } catch (error) {
        console.error("GHL: Unexpected error in contact creation", error);
      }
    })();

    // 4. Send email notification
    const sendMailPromise = (async () => {
      try {
        await sendGetAQuoteMail({
          email: email || undefined,
          phone_number: phone_number || undefined,
          course_level: course_level || undefined,
          course_name: course_name || undefined,
          course_weeks: course_weeks || undefined,
          course_deadline: course_deadline || undefined,
          no_of_pages: no_of_pages || undefined,
          instructions: instructions || undefined,
          gclid: gclid || undefined,
          url: url || undefined,
          fbclid: fbclid || undefined,
          country_name,
        });
      } catch (error) {
        console.error("Email sending error:", error);
      }
    })();

    // Execute all operations in parallel
    await Promise.all([
      createQuotePromise,
      appendValuesPromise,
      createGHLContactPromise,
      sendMailPromise,
    ]);

    return NextResponse.json({
      success: true,
      message: "Quote request received successfully",
    });
  } catch (error) {
    console.error("Error processing quote request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process quote request" },
      { status: 500 }
    );
  }
}
