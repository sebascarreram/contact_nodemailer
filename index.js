let dotenv = require("dotenv");
let express = require("express");
let router = express.Router();
let nodemailer = require("nodemailer");
const cors = require('cors')({ origin: true });

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

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(3002);
