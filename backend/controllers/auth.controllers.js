import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email Already Exists ! " });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Must be at least 6 Characters !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    res.status(201).json(user)
  } catch (error) {
    
    res.status(500).json({message:"SignUP ERROR"});
  }
};


export const Login = async (req, res) => {
  try {
    const {email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email Doesn't Exists ! " });
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Incorrect Password"})
    }
    
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Login Error" });
  }
};

export const LogOut = async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"log Out Succesfully"})
    } catch (error) {
        return res.status(500).json({message:"Logut Error"})
    }
}