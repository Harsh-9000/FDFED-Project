import nodemailer from "nodemailer";

const sendMail = async ({ email, subject, body }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "OccasionMate",
      address: process.env.SMPT_MAIL,
    },
    to: email,
    subject: subject,
    html: body,
  };
  await transporter.sendMail(mailOptions);
};

export default sendMail;
