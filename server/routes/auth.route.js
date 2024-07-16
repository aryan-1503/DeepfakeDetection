import { Router } from "express"
import {UserModel} from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter
    .post("/register",async (req, res) => {
        const { username, email, password } = req.body;
        try{
            const userExists = await UserModel.findOne({ email });
            if (userExists){
                return res.status(400).json({message: "User Already Exists"})
            }
            const newUser = new UserModel({ username,email,password});
            const savedUser = await newUser.save();
            return res.status(200).json({ message: "Registration done successfully", savedUser});
        }
        catch (error) {
            return res.status(500).json({ message : "Something went wrong",error})
        }
    })
    .post("/login",async (req,res) => {
        const { email, password } = req.body;
        try{
            const user = await UserModel.findOne({ email });
            if(!user){
                return res.status(404).json({message: "User not found! Register first"});
            }

            const isPasswordMatch = await bcrypt.compare(password,user.password);
            if (!isPasswordMatch){
                return res.status(400).json({message: "Invalid Credentials"});
            }
            const token = jwt.sign({id: user._id},process.env.SECRET, {expiresIn: '1d'});
            res.cookie('token',token,{
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            return res.status(200).json({message: "Login Successfully",token})
        }catch (error) {
            return res.status(500).json({ message : "Something went wrong",error})
        }
    })
    .post("/logout",(req,res) => {
        res.clearCookie('token',{
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        res.status(200).json({ message: "Logout Successfully"});
    })
    .get("/me", async (req, res) => {
        const { token } = req.cookies;

        console.log("Cookies [me]: ", {
            name: Object.keys(req.cookies),
            ipAddress: req.ip,
        });

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const data = jwt.verify(token, process.env.SECRET);

        if (!data) {
            return res.status(401).json({ msg: "data Unauthorized" });
        }
        const id = data.id
        const user = await UserModel.findById(id);

        res.status(200).json({ user });
    })

export { authRouter }