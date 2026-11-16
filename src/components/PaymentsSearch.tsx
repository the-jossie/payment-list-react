import { FormEvent } from "react";
import { CURRENCIES } from "../constants";
import { I18N } from "../constants/i18n";
import {
  ClearButton,
  FilterRow,
  SearchButton,
  SearchInput,
  Select,
} from "./components";

interface PaymentsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (search: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  isClearable: boolean;
  onClear: () => void;
}

export const PaymentsSearch = ({
  value,
  onChange,
  onSearch,
  currency,
  onCurrencyChange,
  isClearable,
  onClear,
}: PaymentsSearchProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form role="search" aria-label={I18N.SEARCH_LABEL} onSubmit={handleSubmit}>
      <FilterRow>
        <SearchInput
          type="search"
          aria-label={I18N.SEARCH_LABEL}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={currency}
          onChange={(event) => onCurrencyChange(event.target.value)}
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {CURRENCIES.map((currency, index) => (
            <option key={`currency-${index}-${currency}`} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <SearchButton type="submit">{I18N.SEARCH_BUTTON}</SearchButton>
        {isClearable && (
          <ClearButton type="button" onClick={onClear}>
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FilterRow>
    </form>
  );
};
