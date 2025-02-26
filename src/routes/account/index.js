import { Router } from "express";
import { registerUser, verifyUser } from "../../models/account/index.js";
import { body, validationResult } from "express-validator";
import { requireAuth } from "../../utils/index.js";

const router = Router();

// Your registered account route handler
router.get("/", requireAuth, (req, res) => {
  res.send(`Welcome, ${req.session.user.username}!`);
});

// Build an array of validation checks for the registration route
const registrationValidation = [
  body("email").isEmail().withMessage("Invalid email format."),
  body("password")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol."
    ),
];

// Apply the validation checks to the registration route
router.post("/register", registrationValidation, async (req, res) => {
  // Check if there are any validation errors
  const results = validationResult(req);
  if (results.errors.length > 0) {
    results.errors.forEach((error) => {
      req.flash("error", error.msg);
    });
    res.redirect("/account/register");
    return;
  }
});

// Register a new user route (view)
router.get("/register", async (req, res) => {
  res.locals.scripts.push("<script src='/js/registration.js'></script>");
  res.render("account/register", { title: "Register" });
});

// Register a new user route (form submission)
router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (!email || !password || !confirmPassword) {
    req.flash("error", "All fields are required.");
    res.redirect("/account/register");
    return;
  }

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");
    res.redirect("/account/register");
    return;
  }

  const result = await registerUser(email, password);

  if (result.changes === 1) {
    req.flash("success", "Registration successful. You can now log in.");
    res.redirect("/account/login");
    return;
  }

  req.flash("error", "Registration failed. Please try again.");
  res.redirect("/account/register");
});

// Login route (view)
router.get("/login", async (req, res) => {
  res.render("account/login", { title: "Login" });
});

// Login route (form submission)
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.redirect("/account/login");
    return;
  }

  const user = await verifyUser(email, password);

  if (user) {
    req.session.user = user;
    res.redirect("/");
    return;
  }

  res.redirect("/account/login");
});

export default router;
