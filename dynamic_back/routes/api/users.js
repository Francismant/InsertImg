const router = require("express").Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mantfrancis@gmail.com",
    pass: "ukgl avsw begx mfzp",
  },
});

const connection = require("../../database/index");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../upload"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    console.log(file);
    cb(null, true);
  },
});

router.post("/register", upload.single("avatar"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const { email, password } = req.body;
  let avatar;
  if (req.file && req.file.filename) {
    avatar = req.file.filename;
  } else {
    avatar = null;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const sqlVerify = `SELECT * FROM users WHERE email=?`;
  connection.query(sqlVerify, [email], (err, result) => {
    if (err) throw err;
    if (result.length) {
      console.log("EMAIL EXISTANT");
      let isEmail = { message: "Email existant" };
      const filePath = path.join(__dirname, "../../upload", avatar);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Erreur suppression avatar");
        }
        console.log("Avatar supprimé");
      });
      res.send(isEmail);
    } else {
      const sqlInsert =
        "INSERT INTO users (email, password, avatar, verify) VALUES (?, ?, ?, ?)";
      const values = [email, hashedPassword, avatar, 0];
      connection.query(sqlInsert, values, (err, result) => {
        if (err) throw err;
        let idUser = result.insertId;
        console.log(idUser);
        let isEmail = {
          messageGood: "Inscription réussie ! Vous allez être redirigé",
        };
        res.send(isEmail);
      });
    }
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const sql = `SELECT id, avatar, password FROM users WHERE email=?`;
  connection.query(sql, [email], async (err, result) => {
    if (err) throw err;
    if (!result.length) {
      console.log("USER INCORRECT");
      let doesExist = { message: "Email et/ou mot de passe incorrects" };
      res.send(doesExist);
    } else {
      const dbPassword = result[0].password;
      const passwordMatch = await bcrypt.compare(password, dbPassword);
      if (!passwordMatch) {
        console.log("USER INCORRECT");
        let doesExist = {
          message: "Email et/ou mot de passe incorrects",
        };
        res.send(doesExist);
      } else {
        res.json(result[0]);
      }
    }
  });
});

router.get("/resetPassword/:email", (req, res) => {
  console.log(req.params);
  const email = req.params.email;
  const sqlSearchMail = "SELECT * FROM users WHERE email = ?";
  connection.query(sqlSearchMail, [email], (err, result) => {
    if (err) throw err;
    if (result.length !== 0) {
      const confirmLink = `http://localhost:3000/reset?email=${email}`;
      const mailOptions = {
        from: "mantfrancis@gmail.com",
        to: email,
        subject: "Mot de passe oublié de tel site",
        text: `Cliquez sur ce lien pour modifier votre mot de passe : ${confirmLink}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          throw err;
        } else {
          res.end;
        }
      });
    }
  });
});

module.exports = router;
