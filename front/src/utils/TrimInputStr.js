const TrimInputStr = (x) => {
    const replaced = x.replace(/[^\w0-9- ]+/g ,'');
    return replaced;
}

export default TrimInputStr;