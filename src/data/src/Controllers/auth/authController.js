import UserSchema from "../../Models/Users.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

export async function login(req, res) {
    try {
        const user = await UserSchema.findOne({ email: req.body.email})

        if (!user) {
            return res.status(400).json({ message: "Email is wrong"})
        }

        const validPassword = bcrypt.compareSync(req.body.password, user.password)

        if (!validPassword) {
            return res.status(400).json({ message: "Password is wrong"})
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: 86400 })

        res.status(200).json({
            statusCode: 200,
            message: "User logged in",
            data: {
                token
            }
        })
        console.log("User logged in")
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error.message)
    }
}

export async function verifyToken(req, res, next) {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Token is required" })
    }

    try{
        const decoded = jwt.verify(token, SECRET)
        req.userId = decoded.id
        next()
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" })
    }
}