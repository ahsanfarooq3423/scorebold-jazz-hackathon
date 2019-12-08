const keys = require("../config/keys");
const passport = require("passport");
const base_url = keys.baseUrl;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const config = require("../config/keys");
const jwt = require("jsonwebtoken");

module.exports = app => {
  app.post("/api/checkEmailExists", async (req, res) => {
    const existingUser = await User.findOne({
      email: req.body.email
    });

    if (existingUser) {
      console.log("Exists", existingUser);
      res.send({ exists: true });
    } else {
      res.redirect(base_url + "/auth");
    }

    // const user = await new User({ email: req.body.email }).save();
    // console.log(user);
  });

  app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // form validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await new User({
      firstName,
      lastName,
      email,
      password
    });
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user.save();
        if (user) {
          const { id, firstName, lastName, email } = user;
          jwt.sign(
            { id },
            config.jwtSecret,
            { expiresIn: 900 },
            (err, token) => {
              if (err) throw err;
              res.json({ token, user: { id, firstName, lastName, email } });
            }
          );
        }
      });
    });
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    // form validation
    if (!email || !password)
      res.status(400).json({ message: "Please enter all fields" });

    // Check existing
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (!existingUser) res.status(400).json({ message: "User Does not exist" });

    bcrypt.compare(password, existingUser.password).then(isMatch => {
      if (!isMatch) res.status(400).json({ message: "Invalid Credentials" });
      jwt.sign(
        { id: existingUser.id },
        config.jwtSecret,
        { expiresIn: 900 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: existingUser.id,
              firstName: existingUser.firstName,
              lastName: existingUser.lastName,
              email: existingUser.email
            }
          });
        }
      );
    });
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect(base_url + "/classroom");
    }
  );

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      publish_actions: ["profile", "email"]
    })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: base_url + "/classroom",
      failureRedirect: base_url + "/auth"
    })
  );

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send({ status: "success" });
  });

  app.get("/api/current_user", (req, res) => {
    console.log(req.user);
    res.send(req.session.auth);
  });
};
