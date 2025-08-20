import { Router } from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// === Local Auth ===
router.post("/register", authController.register);
router.post("/login", authController.login);

// === Trang chủ: hiển thị nút đăng nhập ===
router.get("/", (req, res) => {
  res.send(`
    <h2>Login Options</h2>
    <a href='/auth/google'>Login With Google</a><br/>
    <a href='/auth/facebook'>Login With Facebook</a><br/>
    <a href='/auth/github'>Login With GitHub</a>
  `);
});

// === Google OAuth ===
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// === Facebook OAuth ===
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// === GitHub OAuth ===
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// === Profile protected route ===
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

router.get("/profile", ensureAuthenticated, (req, res) => {
  const name = req.user?.fullname || req.user?.displayName || req.user?.username || "User";
  res.send(`<h2>Welcome ${name}</h2><a href="/logout">Logout</a>`);
});

// === Logout ===
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// === Forgot / Reset Password ===
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// === User Management ===
router.get("/users", verifyToken, authController.getAllUsers);
router.get("/users/:id", verifyToken, authController.getUserById);
router.put("/users/:id", verifyToken, authController.updateUser);
router.delete("/users/:id", verifyToken, isAdmin, authController.deleteUser);

export default router;
