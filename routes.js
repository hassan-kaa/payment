const express = require("express");
const {
  signUp,
  confirmEmail,
  forgotPassword,
  confirmPassword,
  login,
} = require("./cognito");
const { oneTimePayment } = require("./stripe");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Express App!");
});

// signup route
router.post("/signup", async (req, res) => {
  try {
    const attrList = [
      {
        Name: "email",
        Value: req.body.email,
      },
    ];
    const user = await signUp(req.body.username, req.body.password, attrList);
    console.log(user);
    res.status(200).json(user.username);
  } catch (err) {
    console.log(req.body);
    res.status(500).json(err.message);
  }
});

// confirm email route
router.post("/confirm-email", async (req, res) => {
  try {
    const confirmed = await confirmEmail(req.body.username, req.body.code);
    res.status(200).json(`${confirmed}`);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const confirmed = await forgotPassword(req.body.email);
    res.status(200).json(`${confirmed}`);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//confirm-password
router.post("/confirm-password", async (req, res) => {
  try {
    const confirmed = await confirmPassword(
      req.body.email,
      req.body.code,
      req.body.newPassword
    );
    res.status(200).json(`${confirmed}`);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const session = await login(req.body.username, req.body.password);
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//stripe payement route
router.post("/create-checkout-session", async (req, res) => {
  try {
    const paymentUrl = await oneTimePayment(req.body);
    res.status(200).json(paymentUrl);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Error handling for undefined routes
router.use((req, res) => {
  res.status(404).send("Page not found");
});

module.exports = router;
