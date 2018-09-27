const validator = (text, type) => {
    if (type === 'email') {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text)) {
            return true
        } else {
            return false
        }
    } else if (type === 'password') {
        let reg = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/;
        if (reg.test(text)) {
            return true
        } else {
            return false
        }
    }
}

export default validator;