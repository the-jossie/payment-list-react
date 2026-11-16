import { FormEvent } from "react";
import { CURRENCIES } from "../constants";
import { I18N } from "../../../constants/i18n";
import { PaymentFilters } from "../types";
import {
  ClearButton,
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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFiltersChange({ search: searchQuery.trim() });
  };

  return (
    <form role="search" aria-label={I18N.SEARCH_LABEL} onSubmit={handleSubmit}>
      <FilterRow>
        <SearchInput
          type="search"
          aria-label={I18N.SEARCH_LABEL}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
        />
        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={filters.currency}
          onChange={(event) => onFiltersChange({ currency: event.target.value })}
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
          <ClearButton type="button" onClick={onClear}>
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FilterRow>
    </form>
  );
};
