import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from './../models/user.js';

const secret = 'test';
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser)
            return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid password" });
        //if correct credentials
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '1h' });
        res.status(200).json({ result: oldUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}


export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstname, lastname } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            res.status(400).json({ message: "User with this email already exists" });
        if (password !== confirmPassword)
            res.status.send(400).json({ meassage: "The passwords don't match ,Retry!" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email: email, password: hashedPassword, name: `${firstname} ${lastname}` });
        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: '1h' });
        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}