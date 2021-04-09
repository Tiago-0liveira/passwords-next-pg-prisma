import { User } from ".prisma/client";
import { NextApiRequest } from "next"

export type IUserNecessary = {
    username: string,
    password: string
}
export interface InewUserRequest extends NextApiRequest {
    body: PostUser
}
export type ICheckUserRequest = InewUserRequest

export interface PostUser extends Omit<User, "hashedPassword"> {
    password: string
}
export type hashedString = string;

export interface CustomApiRequest<T> extends NextApiRequest {
    body: T,
    method: string
}
enum UserPostType {
    create = "create",
    auth = "auth"
}
export type IApiBodyUser = {
    username: string,
    password: string
}

export interface IApiBodyUserPost extends IApiBodyUser {
    type: UserPostType,
}
export interface IApiBodyUserPut extends IApiBodyUser {
    newUsername: string,
    newPassword: string
}
export type IApiBodyToken = {
    token: string
}
export type IApiResToken = {
    success: boolean,
    user?: User,
    error?: string
}