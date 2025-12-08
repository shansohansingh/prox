import { connectDB } from "../../../../../lib/mongoose";
import User from "../../../../../models/User";
import jwt from "jsonwebtoken";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { token } = await params;

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required." }), {
        status: 400,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token." }),
        {
          status: 400,
        }
      );
    }

    const email = decoded.email;

    // Try to find user by token or email
    let user = await User.findOne({ verify_token: token });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (
      !user ||
      user.email !== email ||
      user.verify_token !== token ||
      user.verify_token_expiry < new Date()
    ) {
      return new Response(JSON.stringify({ error: "Verification failed." }), {
        status: 400,
      });
    }

    // Update user to set verified
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          verified: true,
        },
        $unset: {
          verify_token: "",
          verify_token_expiry: "",
        },
      }
    );

    return new Response(
      JSON.stringify({ message: "Email verified successfully." }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
