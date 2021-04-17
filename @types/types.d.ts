import { LogInPlatform, User, Row } from "@prisma/client";
import { NextApiRequest } from "next"
import { Dispatch, SetStateAction } from "react";
import { LogInFormState, ModalType, UserPostType, ModalActionType } from "../constants/consts";

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
    data?: TModalData,
    update?: IModalDataUpdateWithLogIn | IModalDataUpdateWithoutLogIn,
    onConfirm: Function
}
export type ModalProps = {
    setModalData: Dispatch<SetStateAction<IModalData>>
    ModalData: IModalData
}
export interface IModalDataBaseUpdate extends ModalNewRowDataBase {
    uuid: string
}
export interface IModalDataUpdateWithLogIn extends IModalDataBaseUpdate {
    logInWithPlatform: LogInPlatform,
}
export interface IModalDataUpdateWithoutLogIn extends IModalDataBaseUpdate {
    username: string,
    password: string
}

export type ModalNewRowDataBase = {
    site: string,
    email: string,
}
export interface ModalNewRowDataWithLogin extends ModalNewRowDataBase {
    logInWithPlatform: LogInPlatform,
}
export interface ModalNewRowDataWithoutLogin extends ModalNewRowDataBase {
    username: string,
    password: string
}

export type ModalNewRowData = ModalNewRowDataWithLogin | ModalNewRowDataWithoutLogin

export type ModalReducerState = {
    Site: string,
    Email: string,
    LogInPlatform: LogInPlatform,
    Username: string,
    Password: string,
    LogInWithPlatForm: boolean,
    passwordShow: boolean,
}
export type ModalUseReducerAction =
    { type: ModalActionType.UpWiPlatform, payload: ModalNewRowDataWithLogin } |
    { type: ModalActionType.UpWoPlatform, payload: ModalNewRowDataWithoutLogin } |
    { type: ModalActionType.setSite, payload: { Site: string } } |
    { type: ModalActionType.setEmail, payload: { Email: string } } |
    { type: ModalActionType.setLogInPlatform, payload: { LogInPlatform: string } } |
    { type: ModalActionType.setUsername, payload: { Username: string } } |
    { type: ModalActionType.setPassword, payload: { Password: string } } |
    { type: ModalActionType.ToggleLogInWithPlatform } |
    { type: ModalActionType.TogglePassword } |
    { type: ModalActionType.Reset }

export type SelectedRow = {
    uuid: string,
    setIsOn: Dispatch<SetStateAction<boolean>>,
    setRow: Dispatch<SetStateAction<Row>>
}
export type onConfirmArgs = {
    uuid: string,
    data: ModalNewRowData
}