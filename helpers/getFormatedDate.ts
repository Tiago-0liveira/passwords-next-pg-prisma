import { TgetFormatedDate } from "../@types/types";

const getFormatedDate: TgetFormatedDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
}
export default getFormatedDate