let dotenv = require("dotenv");
let express = require("express");
let router = express.Router();
let nodemailer = require("nodemailer");
let cors = require("cors");

dotenv.config({ path: "./config.env" });

let transport = {
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
};

let transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post("/send", (req, res, next) => {
  console.log(req.body);
  const name = req.body.name;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const message = req.body.message;
  const content = `Full name: ${name} ${lastname} \n email: ${email} \n message: ${message} `;

  let mail = {
    from: email,
    to: "sebascarreram@hotmail.com", // Change to email address that you want to receive messages on
    subject: "New Message from Contact Form",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

router.post("/send", (req, res, next) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const message = req.body.message;
  const content = `Full name: ${name} ${lastname} \n email: ${email} \n message: ${message} `;

  const msg = {
    to: "sebascarreram@hotmail.com", // Change to your recipient
    from: email, // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: content,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log("error");
      console.error(error);
    });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(3002);
