import { connectDB } from "../../../../lib/mongoose";
import User from "../../../../models/User";
import { sendEmail } from "../../../../lib/mailer";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials." }), {
        status: 401,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials." }), {
        status: 401,
      });
    }

    if (!user.verified) {
      const newVerifyToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "3m",
      });

      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          verify_token: newVerifyToken,
          verify_token_expiry: new Date(Date.now() + 3 * 60 * 1000),
        },
        { new: true }
      );

      await sendEmail({
        to: email,
        subject: "Verify your email - YourApp",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello ${updatedUser.name},</h2>
            <p>Please verify your email by clicking the button below. This link expires in <strong>3 minutes</strong>.</p>
            <a href="${process.env.BASE_URL}/verify/${newVerifyToken}" style="display: inline-block; padding: 10px 20px; margin-top: 12px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p>If you didn’t request this, you can ignore this email.</p>
          </div>
        `,
      });

      return new Response(
        JSON.stringify({
          error:
            "Please verify your email. A new verification link has been sent.",
        }),
        { status: 403 }
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 10 * 365 * 24 * 60 * 60,
    });

    return new Response(JSON.stringify({ message: "Login successful." }), {
      status: 200,
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
