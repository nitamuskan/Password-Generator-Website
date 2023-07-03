const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+=-;:"/?><,.\|[]{}`~';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
  
//it set password length 
function handleSlider() {
    //ui pr reflect krwana kaam h iss funct ka
    //default we are setting password length 10
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100/(max - min) ) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
}
function getRndInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}
function generateLowerCase(){
    //93- ascii value of small a
    //123-ascii value of small z
    //String.fromCharCode -convert digit by ascii value to char
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {
    //65-ascii value of capital A
    //91-ascii value of capital Z
    return String.fromCharCode(getRndInteger(65,91))
}
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    //char at that index =charAt
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && hasNum && hasSymbol && passwordLength >= 9){
        setIndicator("#0f0");
    }else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSymbol) && 
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }

}
async function copyContent(){
    //wait work only when function is async
    // to copy on clipboard
    //if we cant make the password which means error can be generated so use try and catch
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";

    }
      //to make span visible in copy wala
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

    
} 

function shufflePassword(array){
    //fisher yates method = used for shuffling
    //apply on any array to shuffle it
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * ( i + 1 ));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el) => (str +=el));
    return str;
    

}
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
          checkCount++;
    });

    //special case 
    if(passwordLength < checkCount ){
        passwordLength = checkCount;
        handleSlider();
    }
}
 
allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox is selected
    if(checkCount == 0)
     return;
    
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // lets start to find new password
    //remove old password
    password = "";

    //lets put the content mentioned in checkbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheckcaseCheck.checked){
    //     password += generateLowerCaseCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    let funcArr = [];

    if(uppercaseCheck.checked)
       funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
       funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
       funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
       funcArr.push(generateSymbol);
    //compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    //remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++ ){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    //shuffle the password
    //because now the first digit of password is uppercase,second will be lowercase and so on
    //so it is predictable 
    //to avoid this problem we shuffle the password 
    password = shufflePassword(Array.from(password));
    //show in the ui
    passwordDisplay.value = password;
    //calculate strength for type of password it is
    calcStrength();

});