import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
}

export async function sendGetAQuoteMail({
  email,
  phone_number,
  course_level,
  course_name,
  course_weeks,
  course_deadline,
  no_of_pages,
  instructions,
  gclid,
  url,
  fbclid,
  country_name,
}: {
  email?: string;
  phone_number?: string;
  course_level?: string;
  course_name?: string;
  course_weeks?: string;
  course_deadline?: string;
  no_of_pages?: string;
  instructions?: string;
  gclid?: string;
  url?: string;
  fbclid?: string;
  country_name?: string;
}): Promise<void> {
  try {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Get A Quote Request</title>
    <style>
        body, table, td, div {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #2B2275;
        }
        body {
            background-color: #E0D7F5;
            font-size: 16px;
            line-height: 1.5;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #2B2275;
            color: #FFFFFF;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 20px;
            color: #2B2275;
        }
        .summary {
            margin-top: 20px;
            border-collapse: collapse;
            width: 100%;
        }
        .summary td, .summary th {
            padding: 10px;
            border: 1px solid #DDDDDD;
            text-align: left;
            font-size: 14px;
        }
        .summary th {
            background-color: #F2F2F2;
            font-weight: bold;
        }
        .footer {
            background-color: #E0D7F5;
            color: #888888;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        @media only screen and (max-width: 600px) {
            .container { width: 90%; }
            .header, .content, .footer { padding: 15px; }
            .summary td, .summary th { padding: 8px; font-size: 12px; }
            .summary th, .summary td { display: block; width: 100%; text-align: left; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
          Get A Quote Request
        </div>
        <div class="content">
            <p>A new quote request has been made by the client with the following contact: <strong>${email || phone_number || "N/A"}</strong></p>
            <div>
                <p style="font-size: 18px; font-weight: bold; margin-top: 0;">Summary:</p>
                <table class="summary">
                    <tr>
                        <th>Course Name</th>
                        <td>${course_name || ""}</td>
                        <th>Course Level</th>
                        <td>${course_level || ""}</td>
                    </tr>
                    <tr>
                        <th>Course Weeks</th>
                        <td>${course_weeks || ""}</td>
                        <th>Deadline</th>
                        <td>${course_deadline || ""}</td>
                    </tr>
                    <tr>
                        <th>No of Pages</th>
                        <td>${no_of_pages || ""}</td>
                        <th>Instructions</th>
                        <td>${instructions || ""}</td>
                    </tr>
                    <tr>
                        <th>Phone Number</th>
                        <td>${phone_number || ""}</td>
                        <th>Country</th>
                        <td>${country_name || ""}</td>
                    </tr>
                    <tr>
                        <th>Gclid</th>
                        <td>${gclid || ""}</td>
                        <th>Fbclid</th>
                        <td>${fbclid || ""}</td>
                    </tr>
                    <tr>
                        <th>Url</th>
                        <td colspan="3">${url || ""}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ScholarlyHelp. All rights reserved.</p>
            <p>Contact us at: <a href="mailto:support@scholarlyhelp.com" style="color: #2B2275;">support@scholarlyhelp.com</a></p>
        </div>
    </div>
</body>
</html>`;

    const transport = getTransporter();

    await transport.sendMail({
      from: `"ScholarlyHelp" <${process.env.SMTP_USERNAME}>`,
      to: process.env.SCHOLARLY_SUPPORT_EMAIL || "support@scholarlyhelp.com",
      subject: "Client",
      html: template,
    });
  } catch (error) {
    console.error("Email sending error:", error);
  }
}
