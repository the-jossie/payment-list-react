import { I18N } from "../../constants/i18n";
import { CURRENCIES } from "./constants";

export const SEARCH_MAX_LENGTH = 50;
const SEARCH_PATTERN = /^[A-Za-z0-9_-]*$/;

export const validateSearch = (value: string): string | null => {
  const trimmed = value.trim();
  const isValid = trimmed.length <= SEARCH_MAX_LENGTH && SEARCH_PATTERN.test(trimmed);
  return isValid ? null : I18N.SEARCH_INVALID;
};

export const isCurrency = (value: string): boolean =>
  (CURRENCIES as readonly string[]).includes(value);
