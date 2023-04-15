import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";


/* REGISTER USER*/
export const register = async (req, res) => {
    try {
        const { 
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,        
        } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfiles: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message});

    }
};
/* LOGGIN IN */

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "1h" });
        delete user.password;
        res.status(200).json({ token, user });
    }catch (err) {
        res.status(500).json({ error: err.message});
    }
}