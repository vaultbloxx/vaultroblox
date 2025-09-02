import React from "react";

const formatNumber = (numberString) => {
  const number = parseFloat(numberString);

  if (isNaN(number)) {
    return "Invalid Number";
  }

  if (number >= 1_000_000) {
    const divided = number / 1_000_000;
    // keep up to 2 decimals, but remove trailing zeros (e.g. 1.50 -> 1.5)
    return `${parseFloat(divided.toFixed(2))}M`;
  } else if (number >= 1_000) {
    const divided = Math.floor(number / 1_000); // clean integer only
    return `${divided}K`;
  }

  return number.toString();
};

const CountFormatter = ({ value }) => {
  return <span title={value}>{formatNumber(value)}</span>;
};

export default CountFormatter;
