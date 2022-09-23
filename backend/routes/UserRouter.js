const express = require("express");
const router = express.Router();


// Controller
const { register, login, getCurrentUser } = require("../controllers/UserContreller");

// Middlewares

const validate = require("../middlewares/handleValidations");
const { 
    userCreateValidation, 
    loginValidation,
} = require("../middlewares/userValidations")

const authGuard = require("../middlewares/authGuard")

// Routes

router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);

module.exports = router;