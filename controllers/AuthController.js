const User = require('../model/userModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error.message);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Account does not exist" });
    }

    // check password
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // generate JWT
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.SECRETKEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ user: existingUser, token });
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
