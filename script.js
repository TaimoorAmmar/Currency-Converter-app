const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

const apiKey = "";

for(let i = 0; i < dropList.length; i++){
    for (currency_code in country_code){
       //selecting default currency from usd to pkr
        let selected;
        if(i==0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if (i==1){
            selected = currency_code == "PKR" ? "selected" : "";
        }
        //creating option tag with passing currency code as a text and value
        let optionTag = `<option value = "${currency_code}" ${selected}>${currency_code}</option>`;
        //inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); //calling loadFlag with passing target element as an argument

    });
}
function loadFlag(element){
    for(code in country_code){
        if(code == element.value){// if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img");//selecting img tag of particular droplist
            //passing country code of selected currency code in img url
            imgTag.src = `https://countryflagsapi.com/png/${country_code[code]}`

        }
    }
}

window.addEventListener("load", () =>{

    getExchangeRate();

});
getButton.addEventListener("click", e =>{
    e.preventDefault(); //preventing form from submitting
    getExchangeRate();

});
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; //temporary currency code of from drop list
    fromCurrency.value = toCurrency.value; //passing to currency code to from currency code
    toCurrency.value = tempCode; // passing temporary currency code to To currency code
    loadFlag(fromCurrency);//calling loadflag with passing select element (fromcurrency) of from
    loadFlag(toCurrency);//calling loadflag with passing select element (tocurrency) of to
    getExchangeRate();
})

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value; 
    //if user dont enter any value or enter 0, then we will put 1 value by default in the input field
    if(amountVal == "" || amountVal == "0"){
        amount.value="1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    //fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal}${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() =>{// if user is offine or any other error occured while fetching data then catch function will run
        exchangeRateTxt.innerText = "Something went wrong";
    });
}
