import {
    Toast
} from "native-base";

export const handleErrorResponse = (error) => {
    debugger
    let messages = ''
    if (error.data && error.data.message) {
        messages = error.data.message
    } else {
        for (let message in error.data) {
            messages += error.data[message][0] + '\n'
        }
    }

    Toast.show({
        text: messages,
        duration: 3000,
        type: "error"
    })
}