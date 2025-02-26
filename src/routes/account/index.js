import { Router } from "express";
import { registerUser, verifyUser } from "../../models/account/index.js";

const router = Router();

// Register a new user route (view)
router.get("/register", async (req, res) => {
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
