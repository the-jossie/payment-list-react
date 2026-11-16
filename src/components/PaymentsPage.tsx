import { useState } from "react";
import { HttpStatusCode, isAxiosError } from "axios";
import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { Container, ErrorBox, Title } from "./components";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

const getErrorMessage = (error: unknown): string | null => {
  if (!isAxiosError(error)) return null;

  switch (error.response?.status) {
    case HttpStatusCode.NotFound:
      return I18N.PAYMENT_NOT_FOUND;
    case HttpStatusCode.InternalServerError:
      return I18N.INTERNAL_SERVER_ERROR;
    default:
      return null;
  }
};

export const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const [currency, setCurrency] = useState("");
  const { data, error, isFetching } = usePayments({
    page: DEFAULT_PAGE,
    pageSize: PAGE_SIZE,
    search: submittedSearchQuery,
    currency,
  });

  const hasActiveFilters = !!submittedSearchQuery || !!currency;
  const errorMessage = getErrorMessage(error);

  const clearFilters = () => {
    setSearchQuery("");
    setSubmittedSearchQuery("");
    setCurrency("");
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsSearch
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={setSubmittedSearchQuery}
        currency={currency}
        onCurrencyChange={setCurrency}
        isClearable={hasActiveFilters}
        onClear={clearFilters}
      />
      {errorMessage ? (
        <ErrorBox role="alert">{errorMessage}</ErrorBox>
      ) : (
        <PaymentsTable payments={data?.payments ?? []} isLoading={isFetching} />
      )}
    </Container>
  );
};
