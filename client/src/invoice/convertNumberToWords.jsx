// utils/numberToWords.js
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const units = ["", "Thousand", "Lakh", "Crore"];

function convertChunk(chunk) {
  let chunkWords = "";

  if (chunk >= 100) {
    chunkWords += ones[Math.floor(chunk / 100)] + " Hundred ";
    chunk %= 100;
  }

  if (chunk >= 20) {
    chunkWords += tens[Math.floor(chunk / 10)] + " ";
    chunk %= 10;
  }

  if (chunk > 0) {
    chunkWords += ones[chunk] + " ";
  }

  return chunkWords.trim();
}

function convertToWords(number) {
  if (number === 0) return "Zero";

  let words = "";

  if (number >= 10000000) {
    words += convertChunk(Math.floor(number / 10000000)) + " Crore ";
    number %= 10000000;
  }

  if (number >= 100000) {
    words += convertChunk(Math.floor(number / 100000)) + " Lakh ";
    number %= 100000;
  }

  if (number >= 1000) {
    words += convertChunk(Math.floor(number / 1000)) + " Thousand ";
    number %= 1000;
  }

  if (number > 0) {
    words += convertChunk(number);
  }

  return words.trim();
}

function convertNumberToWords(amount) {
  // Round the amount to the nearest whole number
  const roundedAmount = Math.round(amount);

  const words = convertToWords(roundedAmount);

  return words + " Rupees";
}

export default convertNumberToWords;
