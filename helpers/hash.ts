import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
import { hashedString } from "../@types/types";


export default function hash(w: string): hashedString {
    return Base64.stringify(
        hmacSHA512(
            process.env.SAL + sha256(process.env.SAL + w),
            process.env.SAL
        )
    );
}