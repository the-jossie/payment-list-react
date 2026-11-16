import { I18N } from "../../constants/i18n";
import { CURRENCIES } from "./constants";
import { Currency } from "./types";

export const SEARCH_MAX_LENGTH = 100;

const CONTROL_CHARACTERS = /\p{Cc}/gu;
const WHITESPACE_RUNS = /\s+/g;

export const normalizeSearch = (value: string): string =>
  value.replace(CONTROL_CHARACTERS, " ").replace(WHITESPACE_RUNS, " ").trim();

export const validateSearch = (value: string): string | null =>
  Array.from(normalizeSearch(value)).length > SEARCH_MAX_LENGTH
    ? I18N.SEARCH_TOO_LONG
    : null;

export const isCurrency = (value: string): value is Currency =>
  CURRENCIES.some((currency) => currency === value);
