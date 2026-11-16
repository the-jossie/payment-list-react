import { useState } from "react";
import { HttpStatusCode, isAxiosError } from "axios";
import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { Container, ErrorBox, Title } from "./components";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

export const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const { data, error, isFetching } = usePayments({
    page: DEFAULT_PAGE,
    pageSize: PAGE_SIZE,
    search: submittedSearchQuery,
  });

  const hasActiveFilters = !!submittedSearchQuery;
  const isNotFoundError =
    isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound;

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
      {isNotFoundError ? (
        <ErrorBox role="alert">{I18N.PAYMENT_NOT_FOUND}</ErrorBox>
      ) : (
        <PaymentsTable payments={data?.payments ?? []} isLoading={isFetching} />
      )}
    </Container>
  );
};
