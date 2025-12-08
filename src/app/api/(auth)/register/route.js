import User from "../../../../models/User";
import { connectDB } from "../../../../lib/mongoose";
import { sendEmail } from "../../../../lib/mailer";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, contact, password } = body;

    if (!name || !email || !contact || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return new Response(JSON.stringify({ error: "User already exists." }), {
        status: 400,
      });
    }

    const userExistsContact = await User.findOne({ contact });
    if (userExistsContact) {
      return new Response(
        JSON.stringify({ error: "Contact already exists." }),
        { status: 400 }
      );
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "3m",
    });

    const newUser = new User({
      name,
      email,
      contact,
      password,
      verify_token: token,
      verify_token_expiry: new Date(Date.now() + 3 * 60 * 1000),
    });

    await newUser.save();

    const verifyLink = `${process.env.BASE_URL}/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your email for YourApp",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hello ${name},</h2>
          <p>Thanks for registering on <strong>YourApp</strong>!</p>
          <p>Please verify your email by clicking the button below. This link will expire in <strong>3 minutes</strong>.</p>
          <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; margin-top: 12px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ message: "User registered. Verification email sent." }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
