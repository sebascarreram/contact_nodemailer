let express = require("express");
let router = express.Router();
let nodemailer = require("nodemailer");
let cors = require("cors");

let transport = {
  host: process.env.EMAIL_HOST, // Don’t forget to replace with the SMTP host of your provider
  port: process.env.EMAIL_PORT,
  //port: 2525,
  //port: 465,
  //secure: true, // use SSL
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
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
    from: name,
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
