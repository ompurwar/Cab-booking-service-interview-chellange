
let smart_code_map = new Map();
function GetRandomString(length) {
    let alphabet = 'abcdefchijklmnopqrstuvwxyz'.split(''); // can be directly put in to array
    let _string = '';
    for (let index = 0; index < length; index++) {
        let random_index = parseInt((Math.random() * 100) % 26)
        _string += alphabet[random_index];

    }

    return _string;


}
function GetRandomNumber(length) {
    let number_list = '0123456789'.split(''); // can be directly put in to array
    let numeric_string_string = '';
    for (let index = 0; index < length; index++) {
        let random_index = parseInt((Math.random() * 100) % 10)
        numeric_string_string += number_list[random_index];

    }

    return numeric_string_string;


}
function GenerateSmartCode() {

    let smart_code = GetRandomString(4) +'-'+ GetRandomNumber(4)
    
    
    return smart_code;
    
}

// if (!smart_code_map.has(smart_code)) {

// }

for (let index = 0; index < 10000; index++) {
    // const element = array[index];
    let smart_code =GenerateSmartCode()
    if(smart_code_map.has)
    console.log(smart_code)
    
}
