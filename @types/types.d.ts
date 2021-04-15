import { LogInPlatform, User } from "@prisma/client";
import { NextApiRequest } from "next"
import { Dispatch, SetStateAction } from "react";
import { LogInFormState, ModalType, UserPostType } from "../constants/consts";

export default {}

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

export type IApiBodyUser = {
    username: string,
    password: string
}

export interface IApiBodyUserPost extends IApiBodyUser {
    type: UserPostType,
    id?: number
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
export type TuseUser = () => [
    user: User | undefined,
    loading: boolean,
    setUser: Dispatch<SetStateAction<User | undefined>>
]
export type TgetFormatedDate = (date: Date) => String
export type TModalData = {
    usernames: string[],
    sites: string[],
    emails: string[]
}
export interface IModalData {
    type: ModalType,
    isOpen: boolean,
    data?: TModalData
}
type notificationManager = (
    message: string,
    title?: string,
    timeOut?: number,
    callback?: Function,
    priority?: boolean
) => void
export interface ModalProps extends IModalData {
    setModalData: Dispatch<SetStateAction<IModalData>>,
    notificationManager: {
        info: notificationManager
        error: notificationManager
        success: notificationManager
        warning: notificationManagern
    },
    extraData: { userId: number | undefined }
    onConfirm: (row?: Row) => void
}
type ModalNewRowDataBase = {
    site: string,
    email: string,
}
export interface ModalNewRowDataWithLogin extends ModalNewRowDataBase {
    logInWithPlatform: string,
}
export interface ModalNewRowDataWithoutLogin extends ModalNewRowDataBase {
    username: string,
    password: string
}

export type ModalNewRowData = ModalNewRowDataWithLogin | ModalNewRowDataWithoutLogin