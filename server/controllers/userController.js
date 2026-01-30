const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const SALT_LENGTH = 12;

/*---------Signup Controller ------------*/
const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    const emailExists = await User.findOne({ email });
    if (userExists || emailExists)
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    const hashedPassword = bcrypt.hashSync(password, SALT_LENGTH);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = createToken(user.id);
    res.json({ message: "User created", token, user });
  } catch (error) {
    return res.status(400).json({ message: "Error with signup", error: error });
  }
};

/*---------SignIn Controller ------------*/
const signIn = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ message: "username does not exist in DB" });

    const matchPasswords = bcrypt.compareSync(password, user.password);
    if (!matchPasswords) return res.json({ message: "password is incorrect" });

    const token = createToken(user.id);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = { signUp, signIn };
