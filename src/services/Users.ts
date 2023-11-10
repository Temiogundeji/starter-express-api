import User from '../models/User';
import { IUser } from '../@types';
import { AppError, HttpCode } from '../exceptions/AppError';

class UserService {
    async createUser(userData: IUser) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating user"
            }
            );
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await User.findById({ _id: userId });
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            }
            );
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = User.findOne({ email });
            console.log(user);
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            }
            );
        }
    }

    async updateUser(userId: string, userData: IUser) {
        try {
            const user = await User.findByIdAndUpdate(userId, userData, {
                new: true,
            });
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            }
            );
        }
    }

    async deleteUser(userId: string) {
        try {
            const user = await User.findByIdAndDelete({ id: userId });
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "User not found"
            }
            );
        }
    }
}

export default new UserService();
