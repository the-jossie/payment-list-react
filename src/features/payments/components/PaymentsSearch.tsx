import { FormEvent, useId, useState } from "react";
import { CURRENCIES } from "../constants";
import { I18N } from "../../../constants/i18n";
import { PaymentFilters } from "../types";
import { isCurrency, normalizeSearch, validateSearch } from "../validation";
import {
  ClearButton,
  FieldError,
  FilterRow,
  SearchButton,
  SearchInput,
  Select,
} from "../../../shared/ui/styles";

interface PaymentsSearchProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filters: PaymentFilters;
  onFiltersChange: (changes: Partial<PaymentFilters>) => void;
  isClearable: boolean;
  onClear: () => void;
}

export const PaymentsSearch = ({
  searchQuery,
  onSearchQueryChange,
  filters,
  onFiltersChange,
  isClearable,
  onClear,
}: PaymentsSearchProps) => {
  const errorId = useId();
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateSearch(searchQuery);
    setSearchError(error);
    if (error) return;

    onFiltersChange({ search: normalizeSearch(searchQuery) });
  };

  const handleSearchChange = (value: string) => {
    setSearchError(null);
    onSearchQueryChange(value);
  };

  const handleCurrencyChange = (value: string) => {
    onFiltersChange({ currency: isCurrency(value) ? value : "" });
  };

  const handleClear = () => {
    setSearchError(null);
    onClear();
  };

  return (
    <form role="search" aria-label={I18N.SEARCH_LABEL} onSubmit={handleSubmit} noValidate>
      <FilterRow>
        <SearchInput
          type="search"
          aria-label={I18N.SEARCH_LABEL}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
          aria-invalid={searchError ? true : undefined}
          aria-describedby={searchError ? errorId : undefined}
        />
        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={filters.currency}
          onChange={(event) => handleCurrencyChange(event.target.value)}
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <SearchButton type="submit">{I18N.SEARCH_BUTTON}</SearchButton>
        {isClearable && (
          <ClearButton type="button" onClick={handleClear}>
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FilterRow>
      {searchError && (
        <FieldError id={errorId} role="alert">
          {searchError}
        </FieldError>
      )}
    </form>
  );
};
