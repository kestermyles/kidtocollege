import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 })

  try {
    await resend.emails.send({
      from: "KidToCollege <hello@kidtocollege.com>",
      to: email,
      subject: "Welcome to KidToCollege \ud83c\udf93",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 22px; font-weight: 700;">Kid<span style="color: #f59e0b;">To</span>College</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">You're in. \ud83c\udf89</h1>
          <p style="color: #555; font-size: 16px; margin-bottom: 24px;">Private college counsellors charge up to $15,000. Everything they do, you now have \u2014 for free.</p>
          <div style="background: #f9f7f2; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="font-weight: 600; margin-bottom: 12px;">Here's what to do next:</p>
            <ol style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
              <li><a href="https://www.kidtocollege.com/colleges" style="color: #0f2d52;">Browse 2,942 colleges</a> \u2014 filters for D1, Greek life, campus setting</li>
              <li><a href="https://www.kidtocollege.com/my-chances" style="color: #0f2d52;">Check your chances</a> \u2014 get your Safety / On Target / Reach list</li>
              <li><a href="https://www.kidtocollege.com/scholarships" style="color: #0f2d52;">Find scholarships</a> \u2014 $50B available, most families miss them</li>
              <li><a href="https://www.kidtocollege.com/coach" style="color: #0f2d52;">Meet the Coach</a> \u2014 essays, test prep, financial aid, interviews</li>
            </ol>
          </div>
          <a href="https://www.kidtocollege.com/search" style="display: inline-block; background: #f59e0b; color: #1a1a1a; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 16px; margin-bottom: 24px;">Find my college \u2192</a>
          <p style="color: #888; font-size: 13px; border-top: 1px solid #eee; padding-top: 16px; margin-top: 16px;">
            KidToCollege is free to use and editorially independent.
            <a href="https://www.kidtocollege.com/privacy" style="color: #888;">Privacy Policy</a>
          </p>
        </div>
      `
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Welcome email failed:", error)
    return NextResponse.json({ error: "Email failed" }, { status: 500 })
  }
}
