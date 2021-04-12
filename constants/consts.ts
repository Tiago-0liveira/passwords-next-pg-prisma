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