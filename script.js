// Elements to save

const tipCalculatorForm = document.getElementById("tip-calculator");
const billSubtotalElement = document.getElementById("bill");
//const tipPercentageElement = document.getElementById("tip-percentage");
const customTipPercentageInputElement = document.getElementById(
  "tip-percentage-custom"
);
const customTipPercentageRadioElement =
  document.getElementById("custom-percent");

const numberOfPeopleElement = document.getElementById("people");
const tipPerPersonElement = document.getElementById("tip");
const totalPerPersonElement = document.getElementById("total");
const resetButtonElement = document.getElementById("reset-btn");

const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");

const radio = form.querySelectorAll('input[type="radio"]');
const errorSpans = form.querySelectorAll(".input-error");

// Functions

const isResetButtonDisabled = () => {
  return resetButtonElement.disabled;
};

const enableResetButton = () => {
  resetButtonElement.disabled = false;
};

const disableResetButton = () => {
  resetButtonElement.disabled = true;
};

const clearErrors = () => {
  // remove any success or error states for a specific form field
  // render error for each input
  errorSpans.forEach((errorSpan) => {
    errorSpan.textContent = "";
  });
};

const renderElementError = (element) => {
  //console.log(`${element.name}:`);
  //console.log(element.type);
  //console.log(element.validity);
  //console.log(`#${element.id}-error`);

  const errorSpan = document.querySelector(
    element.name == "tip-percentage-custom"
      ? "#tip-percentage-error"
      : `#${element.name}-error`
  );

  if (errorSpan) {
    if (element.type == "radio") {
      //console.log(element.validity);
      if (element.validity.valueMissing) {
        errorSpan.textContent = "Choose a value";
        return;
      }
      errorSpan.textContent = "Radio error";
      return;
    }

    if (element.type == "number") {
      if (element.validity.valueMissing) {
        errorSpan.textContent = "Give a value";
        return;
      }
      if (element.validity.stepMismatch) {
        errorSpan.textContent = "Whole numbers";
        return;
      }
      if (element.validity.rangeUnderflow) {
        if (Number(element.value) == 0) {
          errorSpan.textContent = "Can't be zero";
        } else {
          errorSpan.textContent = "Can't be negative";
        }
        return;
      }
      errorSpan.textContent = "Number error";
      return;
    }

    //console.log(errorSpan);
    errorSpan.textContent = "Other error";
  }
};

const renderError = (message) => {
  // assign an error message to the form
  console.log(`Error: ${message}`);

  // render error for each input
  inputs.forEach((input) => {
    //console.log(input);
    //console.log(input.validity);
    if (input.validity.valid) return;
    renderElementError(input);
  });
};

const getTipPercentage = () => {
  const radioButtonChecked = document.querySelector(
    'input[name="tip-percentage"]:checked'
  );
  if (radioButtonChecked.id == "custom-percent") {
    //console.log(customTipPercentageInputElement.value);
    return customTipPercentageInputElement.value;
  }
  return radioButtonChecked.value;
};

const renderSuccess = () => {
  // render the success state
  // console.log("Success");

  // Get tip percentage value
  const tipPercentage = Number(getTipPercentage());

  const billSubtotal = Number(billSubtotalElement.value);
  const numberOfPeople = Number(numberOfPeopleElement.value);
  const tipTotal = calculateTipTotal(billSubtotal, tipPercentage);
  const billTotal = calculateBillTotal(billSubtotal, tipTotal);

  tipPerPersonElement.value = calculateTipPerPerson(
    tipTotal,
    numberOfPeople
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  totalPerPersonElement.value = calculateTotalBillPerPerson(
    billTotal,
    numberOfPeople
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const anyRadioButtonsChecked = () => {
  return !(
    document.querySelector('input[name="tip-percentage"]:checked') == null
  );
};

// validations for this specific form
const validations = {
  bill: (value) => Number(value) > 0,
  people: (value) => Number(value) > 0,
  "tip-percentage-custom": (value) => Number(value) >= 0,
};

const dataIsValid = (name, value, validations) => {
  // if the value passes validation return true
  // else return false
  if (!validations[name]) return true; // if there's no validation, the field is always valid

  return validations[name](value);
};

const formIsValid = (form, validations) => {
  let isValid = true;
  const data = Object.fromEntries(new FormData(form));

  // Check input fields
  Object.keys(data).forEach((name) => {
    if (!dataIsValid(name, data[name], validations)) {
      isValid = false;
    }
  });

  // Check radio buttons
  if (!anyRadioButtonsChecked()) {
    isValid = false;
  }

  return isValid;
};

// ----------------------------------------
// Calculation Functions
// ----------------------------------------

const calculateTipTotal = (subTotal = 0, tipPercentage = 0) => {
  return (subTotal * tipPercentage) / 100;
};

const calculateTipPerPerson = (tipTotal = 0, numberOfPeople = 1) => {
  if (numberOfPeople < 1) throw new Error("Not valid number of people");
  return tipTotal / numberOfPeople;
};

const calculateBillTotal = (subTotal = 0, tipAmount = 0) => {
  return subTotal + tipAmount;
};

const calculateTotalBillPerPerson = (billTotal = 0, numberOfPeople = 1) => {
  if (numberOfPeople < 1) throw new Error("Not valid number of people");
  return billTotal / numberOfPeople;
};

// ----------------------------------------
// Event Listener Functions
// ----------------------------------------

const handleClickCustomPercent = (e) => {
  //console.log("custom percent clicked: " + e.target.id);
  customTipPercentageRadioElement.checked = true;
  // go through as if the form were submitted
  form.requestSubmit();
};

const handleChange = (e) => {
  // console.log("changed: " + e.target.id);

  // remove error message from the form
  clearErrors();

  // go through as if the form were submitted
  form.requestSubmit();
};

const handleSubmit = (e) => {
  // console.log("submitted");
  e.preventDefault();

  if (isResetButtonDisabled) enableResetButton();

  if (formIsValid(e.target, validations)) {
    renderSuccess();
  } else {
    renderError("Some data you have supplied is invalid!");
  }
};

const handleReset = (e) => {
  disableResetButton();
  clearErrors();
};

// ----------------------------------------
// Add event listeners to all input elements in the form
// ----------------------------------------

customTipPercentageInputElement.addEventListener(
  "click",
  handleClickCustomPercent
);

form.addEventListener("reset", handleReset);
form.addEventListener("submit", handleSubmit);

inputs.forEach((input) => {
  input.addEventListener("change", handleChange);
});
