// lib/sendEmail.ts

import nodemailer from "nodemailer";

export interface SendEmailParams {
  from: string;
  to: string | string[];
  bcc?: string | string[];
  subject: string;

  /**
   * Optional key/value data that will be rendered into a table.
   * Ignored if `html` is provided.
   */
  data?: Record<string, string>;

  /**
   * Optional custom HTML body.
   * If provided, it will be used instead of the default template.
   */
  html?: string;

  logoUrl?: string;
  heading?: string;

  attachments?: {
    content: Buffer | any;
    filename?: string;
  }[];
}

export async function sendEmail({
  from,
  to,
  bcc,
  subject,
  data,
  html,
  logoUrl = "https://assets.cdn.filesafe.space/dtfCxBE6SEYaCMFTlgu5/media/6a4e72d8708c41d4dff4d1f5.png",
  heading = "New Submission",
  attachments,
}: SendEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  await transporter.verify();

  let emailHtml = html;

  if (!emailHtml) {
    const tableRows = Object.entries(data ?? {})
      .map(
        ([key, value]) => `
          <tr>
            <td
              style="
                background:#c1272d;
                color:#ffffff;
                padding:12px;
                border:1px solid #C1C3D1;
                font-weight:bold;
                width:220px;
              "
            >
              ${key}
            </td>

            <td
              style="
                background:#ffffff;
                color:#000000;
                padding:12px;
                border:1px solid #E5E7EB;
              "
            >
              ${value || "-"}
            </td>
          </tr>
        `,
      )
      .join("");

    emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>

        <body
          style="
            margin:0;
            padding:32px;
            background:#f5f5f5;
            font-family:Arial, Helvetica, sans-serif;
          "
        >
          <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="max-width:720px;margin:auto;"
          >
            <tr>
              <td
                style="
                  background:#ffffff;
                  border-radius:12px;
                  overflow:hidden;
                  box-shadow:0 4px 16px rgba(0,0,0,.08);
                "
              >
                <div
                  style="
                    padding:32px;
                    text-align:center;
                    border-bottom:1px solid #eee;
                  "
                >
                  <img
                    src="${logoUrl}"
                    alt="Logo"
                    width="260"
                    style="
                      max-width:100%;
                      height:auto;
                      display:block;
                      margin:auto;
                    "
                  />
                </div>

                <div style="padding:32px;">
                  <h2
                    style="
                      margin-top:0;
                      margin-bottom:24px;
                      color:#111827;
                    "
                  >
                    ${heading}
                  </h2>

                  <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="
                      border-collapse:collapse;
                      border:1px solid #E5E7EB;
                    "
                  >
                    ${tableRows}
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  await transporter.sendMail({
    from,
    to,
    bcc,
    subject,
    html: emailHtml,
    attachments,
  });
}
