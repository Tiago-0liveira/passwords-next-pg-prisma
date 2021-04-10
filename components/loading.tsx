import Head from "next/head"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'


const Loading = () => {
    return <FontAwesomeIcon icon={faCircleNotch} spin size={"5x"} color={"#09203f"} />
}

export default Loading