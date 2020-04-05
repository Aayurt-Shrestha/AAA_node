require("dotenv").config();
module.exports = {
  email: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS
    }
  },
  emailVerification: {
    verificationUrl: "",
    passwordResetUrl: "localhost:8080/change-password/"
  },
  login: {
    jwtExpiration: 10000,
    jwtEncryption: "AAA"
  }
};
