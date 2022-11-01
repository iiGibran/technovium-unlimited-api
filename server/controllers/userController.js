require("../models/db");
const User = require("../models/User");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");

/**
 * /api/user/{id}
 * GET user based on id
 */

exports.getUser = async (req, res) => {
  let paramID = req.params.id;
  try {
    const user = await User.findOne({ _id: paramID });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/**
 * /api/user/signup/{username}
 * POST create new user
 */

exports.createUser = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    // expand fields <<
    // check if data doesn't exsist yet
  });

  try {
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err });
  }
};

exports.passwordReset = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
};

// router.post("/:userId/:token", async (req, res) => {
//     try {
//         const schema = Joi.object({ password: Joi.string().required() });
//         const { error } = schema.validate(req.body);
//         if (error) return res.status(400).send(error.details[0].message);

//         const user = await User.findById(req.params.userId);
//         if (!user) return res.status(400).send("Invalid link or expired");

//         const token = await Token.findOne({
//             userId: user._id,
//             token: req.params.token,
//         });
//         if (!token) return res.status(400).send("Invalid link or expired");

//         user.password = req.body.password;
//         await user.save();
//         await token.delete();

//         res.send("password reset successfully.");
//     } catch (error) {
//         res.send("An error occured");
//         console.log(error);
//     }
// });

