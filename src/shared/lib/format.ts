import { format, isValid } from "date-fns";

export const formatAmount = (amount: number): string => amount.toFixed(2);

export const formatDate = (date: string): string => {
  const parsedDate = new Date(date);
  return isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy, HH:mm:ss") : date;
};
