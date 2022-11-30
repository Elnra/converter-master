// Currency buttons
const convertFromBtns = document.querySelectorAll(".convert-from .currency");
const convertToBtns = document.querySelectorAll(".convert-to .currency");

// Input fields
const convertFromInput = document.querySelector(".convert-from input");
const convertToInput = document.querySelector(".convert-to input");

// Info fields
const infoFrom = document.querySelector(".convert-from .currency-info");
const infoTo = document.querySelector(".convert-to .currency-info");

// Error pop up
const popupEl = document.getElementById("popup");
const closePopUp = document.querySelector(".popup-close");

// Converting functions
const debouncedFromInput = debounce(() => convert("from", "to"), 600);
const debouncedToInput = debounce(() => convert("to", "from"), 600);

function handleSelect(buttons, reverse = false) {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      debouncedFromInput();

      if (button.classList.contains("selected")) return;
      buttons.forEach((button) => button.classList.remove("selected"));
      button.classList.add("selected");
    });
  });
}

function debounce(func, delay = 250) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

handleSelect(convertFromBtns);
handleSelect(convertToBtns, true);

function convert(from, to) {
  const fromCurrency = document.querySelector(
    `.convert-${from} .currency.selected`
  ).id;

  const toCurrency = document.querySelector(
    `.convert-${to} .currency.selected`
  ).id;

  let amount = from === "from" ? convertFromInput.value : convertToInput.value;
  if (navigator.onLine) {
    fetch(
      `https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let rate = data.rates[toCurrency];
        let total = rate * amount;
        if (from === "from") {
          convertToInput.value = total.toPrecision(8);
        } else if (from === "to") {
          convertFromInput.value = total.toPrecision(8);
        }
        infoFrom.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
        infoTo.textContent = `1 ${toCurrency} = ${(1 / rate).toPrecision(
          8
        )} ${fromCurrency}`;
      });
  } else {
    popupEl.classList.replace("hide", "show");
  }
}

convertFromInput.addEventListener("keypress", (e) => {
  debouncedFromInput();
});

convertToInput.addEventListener("keypress", () => {
  debouncedToInput();
});

closePopUp.addEventListener("click", () => {
  popupEl.classList.replace("show", "hide");
});

if (navigator.onLine) {
  fetch(`https://api.exchangerate.host/latest?base=USD&symbols=RUB`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let rate = data.rates["RUB"];
      infoFrom.textContent = `1 RUB = ${rate} USD`;
      infoTo.textContent = `1 USD = ${(1 / rate).toPrecision(8)} RUB`;
    });
}
