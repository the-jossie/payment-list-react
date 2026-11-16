import { format } from "date-fns";

export const formatAmount = (amount: number): string => amount.toFixed(2);

export const formatDate = (date: string): string =>
  format(new Date(date), "dd/MM/yyyy, HH:mm:ss");
