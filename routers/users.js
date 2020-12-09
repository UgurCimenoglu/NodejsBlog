const express = require("express");
const router = express.Router();
const userSchema = require("../model/user");

router.get("/register", (req, res) => {
  res.render("site2/register");
});

router.post("/register", (req, res) => {
  userSchema.create(req.body, (err, data) => {
    req.session.sessionFlash = {
      type:`alert alert-success`,
      message : `Kullanıcı Başarılı Bir Şekilde Oluşturuldu.`
  }
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res) => {
  res.render("site2/login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  userSchema.findOne({ email }, (error, user) => {
    if (user) {
      if (user.password === password) {
        //User Session
        req.session.userId = user._id;
        res.redirect("/");
      } else {
        res.redirect("/users/login");
      }
    } else {
      res.redirect("/users/register");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(()=>{
    res.redirect("/")
  })
});

module.exports = router;
