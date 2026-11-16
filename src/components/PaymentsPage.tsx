import { useState } from "react";
import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { Container, Title } from "./components";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

export const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const { data, isFetching } = usePayments({
    page: DEFAULT_PAGE,
    pageSize: PAGE_SIZE,
    search: submittedSearchQuery,
  });

  const hasActiveFilters = !!submittedSearchQuery;

  const clearFilters = () => {
    setSearchQuery("");
    setSubmittedSearchQuery("");
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsSearch
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={setSubmittedSearchQuery}
        isClearable={hasActiveFilters}
        onClear={clearFilters}
      />
      <PaymentsTable payments={data?.payments ?? []} isLoading={isFetching} />
    </Container>
  );
};
