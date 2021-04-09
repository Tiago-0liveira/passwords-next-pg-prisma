import { User } from ".prisma/client";
import { NextApiRequest } from "next"

export interface IUserNecessary {
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
    body: T
}
enum UserPostType {
    create = "create",
    auth = "auth"
}
export interface IApiBodyUser {
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