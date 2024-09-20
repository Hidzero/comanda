import userRepositories from "../Repositories/userRepositorie.js";
import UserSchema from "../Models/Users.js";
import bcrypt from "bcrypt";

export async function createUser (req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    
    try {
        const newUser = new UserSchema(req.body)

        const savedUser = await newUser.save()

        res.status(201).json({
            statusCode: 201,
            message: "User created successfully",
            data: {
                savedUser
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function getAllUsers(_, res) {
    try {
        const users = await userRepositories.findAllUsers();
        res.status(200).json({
            statusCode: 200,
            message: "All users",
            data: {
                users
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function getUserById(req, res) {
    try {
        const user = await userRepositories.findById(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "User found",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function getUserByAnything(req, res) {
    try {
        const user = await userRepositories.findByAnything(req.body);
        res.status(200).json({
            statusCode: 200,
            message: "User found",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function updateUserById(req, res) {
    try {
        const user = await userRepositories.updateById(req.params.id, req.body);
        res.status(200).json({
            statusCode: 200,
            message: "User updated",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function updateUserByAnything(req, res) {
    try {
        const user = await userRepositories.updateByAnything(req.params, req.body);
        res.status(200).json({
            statusCode: 200,
            message: "User updated",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function deleteUserById(req, res) {
    try {
        const user = await userRepositories.deleteById(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "User deleted",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

export async function deleteUserByAnything(req, res) {
    try {
        const user = await UserRepository.deleteByAnything(req.params);
        res.status(200).json({
            statusCode: 200,
            message: "User deleted",
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}