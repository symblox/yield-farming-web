import { BigNumber } from "bignumber.js";

BigNumber.config({
  EXPONENTIAL_AT: [-100, 100],
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  DECIMAL_PLACES: 18,
});
export default BigNumber;
export function bnum(val) {
  const number = typeof val === "string" ? val : val ? val.toString() : "0";
  return new BigNumber(number);
}
