export default {}


export const HEADERS = {
    "Content-Type": "application/json",
}

export enum UserPostType {
    create = "create",
    auth = "auth"
}
export enum LogInFormState {
    LogIn,
    SignIn,
    App
}
export enum SortState {
    Site,
    Username
}