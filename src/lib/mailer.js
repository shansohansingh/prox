import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), // make sure it's a number
  secure: false, // true for port 465, false for 587 or others
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: "tanishkk60@gmail.com",
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error(
      "❌ Nodemailer error:",
      error.response || error.message || error
    );
    throw new Error("Failed to send email");
  }
};
