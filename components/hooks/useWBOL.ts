import { useEffect, useState } from "react";


const useWBOL = () => {
    const [WBOL, setWBOL] = useState<boolean>(true)

    return [WBOL, setWBOL]
}

export default useWBOL