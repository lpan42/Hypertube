
const toUpperCase = (string) => {
    if(string){
        const upper = string.charAt(0).toUpperCase() + string.substring(1);
        return upper;
    }
}

export default toUpperCase;