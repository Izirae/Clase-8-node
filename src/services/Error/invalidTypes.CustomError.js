export const invalidTypesGenerateCause = (tipos)=>{
   let message = `Uno de los siguientes campos esta ausente o su tipo es incorrecto: `
   for (const variable in tipos){
    console.log(variable)
    message = message + variable + ` debe ser ` + tipos[variable] + `, `
   }
   return message
}