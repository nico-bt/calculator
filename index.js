// ==========================================
// select buttons
// ==========================================
const buttons = document.querySelectorAll(".btn");
const visorRow1 = document.querySelector(".row1");
const visorRow2 = document.querySelector(".row2");
const equal = document.querySelector(".equal");
const AC = document.querySelector("#AC");
const del = document.querySelector("#del");

//===========================================
// EventListeners
// =========================================
buttons.forEach((btn)=>btn.addEventListener("click", (e)=>{
    showInDisplay(e)
}));
equal.addEventListener("click", operationFromVisor)
AC.addEventListener("click", allClear)
del.addEventListener("click", (e)=> deletePrevious(e))

//===========================================
// Functions
// ==========================================
let equalWasPreviousPress = null;

function operationFromVisor() {
    let operation = visorRow1.textContent
    let operationLastElement = operation[operation.length-1]

    // If last entry is an operand +,-,*,/,. it is removed for enable math (eg "85+25+")
    if(operationLastElement=="+" || operationLastElement=="-" || operationLastElement=="*" || operationLastElement=="/" || operationLastElement=="."){
        operation = operation.slice(0,-1)
    }
    // Calculation
    let result
    try {
        if (typeof(eval(`${operation}`))=="number") {
            result = eval(`${operation}`)
        }
    } catch (error) {
        return visorRow2.textContent = "Error!"
    }

    // For numbers over 26 digits show scientific notation:
    if (result.toLocaleString().length>26) {
        visoRow2.textContent= result.toExponential()
    } else {
        visorRow2.textContent=result.toLocaleString('en-US', {maximumFractionDigits:16});
    }

    visorRow1.textContent=result
    equalWasPreviousPress=true;
}

function allClear() {
    visorRow1.textContent="";
    visorRow2.textContent="";
}

function showInDisplay(e) {
    let pressed = e.target.textContent;
    let classList = Array.from(e.target.classList)
    let lastElement = Array.from(visorRow1.textContent).slice(-1)
    
    // Pressing '=' or 'del' do not add symbols to the display
    if (pressed=="=" || pressed=="del") return
    
    // If last key was "=" and next key is not an operator(+,-,*,/) to concatenate operations on the last result --> allClear() to start new calculations
    if(equalWasPreviousPress && !classList.includes("operator")){
        allClear()
        equalWasPreviousPress=false
    }
    //Pressing an operator twice only display the last one
    if( classList.includes("operator") && (lastElement=="+" || lastElement=="-" || lastElement=="*" || lastElement=="/") ){
        //replace last operator with the new one pressed:
        let visorRow1Array = Array.from(visorRow1.textContent)
        visorRow1Array.splice(-1,1,pressed)
        return(visorRow1.textContent = visorRow1Array.join(""));
    }
    // Avoiding enter to consecutive decimal points (eg "25....254")
    if( pressed=="." && lastElement=="."){
        return
    }

    //Add content pressed
    visorRow1.textContent+=pressed;
    equalWasPreviousPress=false;
}

function deletePrevious(e) {
    visorRow1.textContent = (Array.from(visorRow1.textContent).slice(0,-1)).join("")
}

//Add keyboard functionality
window.addEventListener("keydown",(e)=>{
    // console.log(e.key)
    try {
        let keyPressed=document.querySelector(`.btn[data-key="${e.key}"]`)
        keyPressed.click()
        keyPressed.classList.add("btnActiveKeyboard")
        setTimeout(()=>keyPressed.classList.remove("btnActiveKeyboard"),200)
    } catch (error) {}
  })