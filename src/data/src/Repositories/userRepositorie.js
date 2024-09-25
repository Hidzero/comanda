import User from '../Models/Users.js'

class UserRepository {
    async create(userData) {
        const user = new User(userData);
        await user.save();
        return user;
    }

    async findAllUsers() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByAnything(data) {
        return await User.find(data);
    }

    async updateById(id, userdata) {
        return await User.findByIdAndUpdate(id, userdata, { new:true })
    }

    async updateByAnything(data, newData) {
        return await User.findOneAndUpdate(data, newData, { new:true })
    }

    async deleteById(id) {
        return await User.findByIdAndDelete(id)
    }

    async deleteByAnything(data) {
        return await User.findOneAndDelete(data)
    }

}

const userRepositories = new UserRepository();
export default userRepositories;