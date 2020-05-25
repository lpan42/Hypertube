import decode from "jwt-decode";

const validateToken = (token) => {
    return decode(token)['userid'];
}

export default validateToken;