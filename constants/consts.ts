import { LogInPlatform } from "@prisma/client"

export default {}


export const HEADERS = {
    "Content-Type": "application/json",
}
export enum UserPostType {
    create,
    auth,
    logOut
}
export enum RowPostType {
    get,
    create,
    all
}
export enum LogInFormState {
    LogIn,
    SignIn,
    App
}
export enum AppStyle {
    Old,
    OldEnhanced,
    New
}
export enum ModalType {
    Confirmation,
    New
}
export enum ModalEventName {
    Confirm = "Confirm",
    Cancel = "Cancel"
}
export enum ModalActionType {
    UpWiPlatform,/* update with platform */
    UpWoPlatform, /* update without platform */
    setSite, /* update site */
    setEmail, /* update email */
    setLogInPlatform, /* update LogInPlatform */
    setUsername, /* update Username */
    setPassword, /* update Password */
    TogglePassword, /* toggle password */
    ToggleLogInWithPlatform, /* toggle logInWithPlatform */
    Reset
}
import { faGithub, faReddit, faFacebook, faGoogle, faDiscord, IconDefinition } from "@fortawesome/free-brands-svg-icons"

export const LogInPlatforms:
    { value: LogInPlatform, icon: IconDefinition }[] = [
        { value: LogInPlatform.Google, icon: faGoogle },
        { value: LogInPlatform.Git, icon: faGithub },
        { value: LogInPlatform.Facebook, icon: faFacebook },
        { value: LogInPlatform.Reddit, icon: faReddit },
        { value: LogInPlatform.Discord, icon: faDiscord },
    ]

export const LogInPlatformIconColors:
    { [key: string]: string } = {
    [LogInPlatform.Google]: "#007bff",
    [LogInPlatform.Git]: "white",
    [LogInPlatform.Facebook]: "#007bff",
    [LogInPlatform.Reddit]: "#FF5700",
    [LogInPlatform.Discord]: "#7289da",
}