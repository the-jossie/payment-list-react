import { useState } from "react";
import { HttpStatusCode, isAxiosError } from "axios";
import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { PaymentFilters } from "../types/payment";
import { Container, ErrorBox, Title } from "./components";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

const INITIAL_FILTERS: PaymentFilters = {
  search: "",
  currency: "",
};

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
  const [filters, setFilters] = useState<PaymentFilters>(INITIAL_FILTERS);
  const { data, error, isFetching } = usePayments({
    page: DEFAULT_PAGE,
    pageSize: PAGE_SIZE,
    ...filters,
  });

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const errorMessage = getErrorMessage(error);

  const updateFilters = (changes: Partial<PaymentFilters>) =>
    setFilters((current) => ({ ...current, ...changes }));

  const clearFilters = () => {
    setSearchQuery("");
    setFilters(INITIAL_FILTERS);
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsSearch
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        filters={filters}
        onFiltersChange={updateFilters}
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
