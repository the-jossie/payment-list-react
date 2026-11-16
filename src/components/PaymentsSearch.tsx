import { FormEvent, useState } from "react";
import { I18N } from "../constants/i18n";
import { FilterRow, SearchButton, SearchInput } from "./components";

interface PaymentsSearchProps {
  onSearch: (search: string) => void;
}

export const PaymentsSearch = ({ onSearch }: PaymentsSearchProps) => {
  const [value, setValue] = useState("");

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
          onChange={(event) => setValue(event.target.value)}
        />
        <SearchButton type="submit">{I18N.SEARCH_BUTTON}</SearchButton>
      </FilterRow>
    </form>
  );
};
