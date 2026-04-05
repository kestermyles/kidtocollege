import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { collegeName, website, page } = await req.json();

  if (!collegeName) {
    return NextResponse.json({ error: "College name required" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "KidToCollege <hello@kidtocollege.com>",
      to: "hello@kidtocollege.com",
      subject: `College suggestion: ${collegeName}`,
      html: `
        <p><strong>College suggested:</strong> ${collegeName}</p>
        <p><strong>Website:</strong> ${website || "not provided"}</p>
        <p><strong>Submitted from:</strong> ${page || "/my-chances"}</p>
        <p><strong>Date:</strong> ${new Date().toISOString()}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
