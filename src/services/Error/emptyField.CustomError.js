export const emptyFieldGenerateCause = (campos)=>{
    console.log(campos)
    let message = "Uno de los siguientes campos obligatorios esta ausente: "
    let convertedString = campos.toString()
    message = message + convertedString
    return message
 }