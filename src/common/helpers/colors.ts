import { COLORS } from "../constants.js";

export const red = (text: string): string =>
  `${COLORS.RED}${text}${COLORS.RESET}`;

export const green = (text: string): string =>
  `${COLORS.GREEN}${text}${COLORS.RESET}`;
