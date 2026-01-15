import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (cents: number, currencySymbol = "€") => {
  const normalized = Number.isFinite(cents) ? cents : 0;
  const absValue = Math.abs(normalized);
  const value = absValue / 100;
  const hasDecimals = absValue % 100 !== 0;
  const formatted = value.toFixed(hasDecimals ? 2 : 0);
  const sign = normalized < 0 ? "-" : "";
  return `${sign}${formatted}${currencySymbol}`;
};
