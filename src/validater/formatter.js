const a = function trmi() {
    let text1 = "     coding bootcamp   "
    let rst = text1.trim()
    console.log(rst)
}
module.exports.t = a
const lowerc = function changetoLowerCase() {
    let text2 = "coding bootcamp"
    let rst2 = text2.toLocaleLowerCase();
    console.log(rst2)
}
module.exports.c = lowerc


const upperc = function changeTOUpperCase() {
    let text3 = "coding bootcamp"
    let rst3 = text3.toLocaleUpperCase();
}
module.exports.c = upperc
