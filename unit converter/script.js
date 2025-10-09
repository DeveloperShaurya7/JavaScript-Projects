// Get DOM elements
const type = document.getElementById("type");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

// Units for each category
const units = {
    length: ["Meter", "Kilometer", "Centimeter", "Millimeter", "Mile", "Yard", "Foot", "Inch"],
    weight: ["Kilogram", "Gram", "Milligram", "Pound", "Ounce"],
    temperature: ["Celsius", "Fahrenheit", "Kelvin"]
};

// Conversion rates for length and weight
const conversionRates = {
    length: {
        Meter: 1,
        Kilometer: 1000,
        Centimeter: 0.01,
        Millimeter: 0.001,
        Mile: 1609.34,
        Yard: 0.9144,
        Foot: 0.3048,
        Inch: 0.0254
    },
    weight: {
        Kilogram: 1,
        Gram: 0.001,
        Milligram: 0.000001,
        Pound: 0.453592,
        Ounce: 0.0283495
    }
};

// Populate the From/To dropdowns
function populateUnits() {
    // Clear current options
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    // Add new options for the selected type
    for (let i = 0; i < units[type.value].length; i++) {
        const unit = units[type.value][i];
        const optionFrom = document.createElement("option");
        optionFrom.value = unit;
        optionFrom.text = unit;
        fromUnit.add(optionFrom);

        const optionTo = document.createElement("option");
        optionTo.value = unit;
        optionTo.text = unit;
        toUnit.add(optionTo);
    }
}

// Conversion functions
function convertLength(value, from, to) {
    return value * conversionRates.length[from] / conversionRates.length[to];
}

function convertWeight(value, from, to) {
    return value * conversionRates.weight[from] / conversionRates.weight[to];
}

function convertTemperature(value, from, to) {
    let tempInCelsius;

    // Convert input to Celsius first
    if (from === "Celsius") tempInCelsius = value;
    else if (from === "Fahrenheit") tempInCelsius = (value - 32) * 5 / 9;
    else if (from === "Kelvin") tempInCelsius = value - 273.15;

    // Convert Celsius to target unit
    if (to === "Celsius") return tempInCelsius;
    else if (to === "Fahrenheit") return (tempInCelsius * 9 / 5) + 32;
    else if (to === "Kelvin") return tempInCelsius + 273.15;
}

// Handle conversion button click
function handleConversion() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.innerText = "Please enter a valid number.";
        return;
    }

    let convertedValue;

    if (type.value === "length") {
        convertedValue = convertLength(value, fromUnit.value, toUnit.value);
    } else if (type.value === "weight") {
        convertedValue = convertWeight(value, fromUnit.value, toUnit.value);
    } else if (type.value === "temperature") {
        convertedValue = convertTemperature(value, fromUnit.value, toUnit.value);
    }

    result.innerText = `Result: ${convertedValue.toFixed(4)} ${toUnit.value}`;
}

// Event listeners
type.addEventListener("change", populateUnits);
convertBtn.addEventListener("click", handleConversion);

// Initialize dropdowns on page load
populateUnits();
