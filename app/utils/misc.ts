import { type ClassValue, clsx } from "clsx/lite";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { clsx, cn };
