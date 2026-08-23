<?php
function escapeValue(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, "UTF-8");
}

function validateBillInput(string $name, string $consumerNumber, string $unitsInput): string
{
    if ($name === "") {
        return "Please enter the consumer name.";
    }

    if ($consumerNumber === "") {
        return "Please enter the consumer number.";
    }

    if ($unitsInput === "" || filter_var($unitsInput, FILTER_VALIDATE_INT) === false || (int) $unitsInput <= 0) {
        return "Please enter units as a positive whole number.";
    }

    return "";
}

function calculateBill(int $units): float
{
    if ($units <= 50) {
        return $units * 3.50;
    }

    if ($units <= 150) {
        return (50 * 3.50) + (($units - 50) * 4.00);
    }

    if ($units <= 250) {
        return (50 * 3.50) + (100 * 4.00) + (($units - 150) * 5.20);
    }

    return (50 * 3.50) + (100 * 4.00) + (100 * 5.20) + (($units - 250) * 6.50);
}
