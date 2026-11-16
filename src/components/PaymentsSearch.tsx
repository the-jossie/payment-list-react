import { FormEvent } from "react";
import { I18N } from "../constants/i18n";
import {
  ClearButton,
  FilterRow,
  SearchButton,
  SearchInput,
} from "./components";

interface PaymentsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (search: string) => void;
  isClearable: boolean;
  onClear: () => void;
}

export const PaymentsSearch = ({
  value,
  onChange,
  onSearch,
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
