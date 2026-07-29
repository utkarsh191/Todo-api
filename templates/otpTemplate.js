const otpTemplate = (otp) => {
  return `
    <div style="font-family: Arial,sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">
      <h2 style="color:#333;">Email Verification</h2>

      <p>Hello,</p>

      <p>Your One-Time Password (OTP) is:</p>

      <h1 style="text-align:center; color:#2563eb; letter-spacing:5px;">
        ${otp}
      </h1>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not request this, please ignore this email.</p>

      <hr>

      <p style="font-size:12px; color:gray;">
        This is an automated email. Please do not reply.
      </p>
    </div>
  `;
};

module.exports = otpTemplate;