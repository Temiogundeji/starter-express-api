import mongoose, { Document } from 'mongoose';

export enum UserRole {
    User = "user",
    Admin = "admin"
}
export type Refresh = {
    token: string
    user: IUser
    expiryDate: Date
}


export interface IUser extends Document {
    // _id: string,
    firstName: string;
    lastName: string;
    email?: string;
    gender: 'male' | 'female';
    isActive: boolean;
    address?: string;
    staffId: string;
    staffType: 'teaching' | 'non-teaching'
    dob?: string;
    phoneNumber?: string;
    password?: string;
    accessToken?: string;
    refreshToken?: string;
    image?: string;
    loading?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    role: UserRole;
}

export type RegisterType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type PaymentType = {
    amount: number,
    description: string
}


export type ChangeStatusType = {
    deactivate: boolean;
};