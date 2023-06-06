const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay= document.querySelector("[dataLengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copybtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const numbersCheck= document.querySelector("#numbers");
const lowercaseCheck= document.querySelector("#lowercase");
const symbolCheck= document.querySelector("#symbol");

const indicator= document.querySelector("[dataIndicator]");
const generatebtn= document.querySelector(".generateButton");
const allCheck= document.querySelectorAll("input[type=checkbox]");
const symbols= '~`!@#$%^&*()_+=[]{};:"<.>,?/';


let password="";
let passwordLength= 10;
let checkCount=0;
handleSlider();

//set color of the circle to grey at the starting
setIndicator("#ccc");


//set passsword length
function handleSlider(){
    inputSlider.value= passwordLength;
    lengthDisplay.innerText= passwordLength;

    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/max-min)+"% 100%";

}

//set the property of the indicator

function setIndicator(color){
    indicator.style.backgroundColor= color;
    //shadow addition
    indicator.style.boxShadow= '0px 0px 12px 1px ${color}';
}

//get a random integer
function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min))+ min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum= getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);

}

function calcStrength(){
    let hasupper= false;
    let haslower= false;
    let hassymb= false;
    let hasNum= false;

    if (uppercaseCheck.checked) {
        hasUpper=true;    
    }
    if (lowercaseCheck.checked) {
        haslower=true;    
    } if (numbersCheck.checked) {
        hasNum=true;    
    } if (symbolCheck.checked) {
        hassymb=true;    
    }

    if(hasupper && haslower && (hasNum|| hassymb) && passwordLength>=8){
        setIndicator("#0f0");
    }else if((haslower || hasupper) && (hasNum|| hassymb)&& passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00")
    }
}

// copy to the clipboard

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText= "copied";
    }
    catch(err){
        copyMsg.innerText="failed!";
    }
    // ti make the copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");

    },3000);
}

inputSlider.addEventListener('input', function(e){
    passwordLength=e.target.value;
    handleSlider(); 
})

copybtn.addEventListener("click", ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})


//shuffle function
function shufflePassword(array){
    //Fisher Yates method

    for(let i=array.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp= array[i];
        array[i]=array[j];
        array[j]= temp;

    }
    let str="";
    array.forEach((el)=>{
        str+=el;
    })
    return str;
}

function handlecheckboxChange(){
    checkCount=0;
    allCheck.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheck.forEach((checkbox)=>{
    checkbox.addEventListener("change", handlecheckboxChange);
})


generatebtn.addEventListener("click", ()=>{
    //if no checkBox are ticked
    if(checkCount==0){
        return;
    }

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //generate the new password

    console.log("jouney started");
    password="";

    // choose the password based on the ticked checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();

    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
        
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
        
    // }
    // if(symbolCheck.checked){
    //     password+=generateSymbol();
        
    // }

    //making a function array
    let functArray=[];
    
    if(uppercaseCheck.checked){
        functArray.push(generateUppercase)
    }
    if(lowercaseCheck.checked){
        functArray.push(generateLowercase);

    }

    if(numbersCheck.checked){
        functArray.push(generateRandomNumber);
    }

    if(symbolCheck.checked){
        functArray.push(generateSymbol);
    }


    //calling the compulsory functions which are checked

    console.log("doing the compulsory password addition");

    for (let i = 0; i < functArray.length; i++) {
       password += functArray[i]();
        
    }

    //remaining addition

    console.log("doing the random addition");
    for( let i=0; i< passwordLength-functArray.length; i++){
        let randomIndex= getRandomInteger(0,functArray.length);

        password+= functArray[randomIndex]();
    }

    //shuffle the password
    password= shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();


})




