import { useState } from "react";
import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { PaymentFilters } from "../types/payment";
import { ApiErrorType } from "../types/error";
import { Container, ErrorBox, Title } from "./components";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

const INITIAL_FILTERS: PaymentFilters = {
  search: "",
  currency: "",
};

const ERROR_MESSAGES: Record<ApiErrorType, string> = {
  "not-found": I18N.PAYMENT_NOT_FOUND,
  server: I18N.INTERNAL_SERVER_ERROR,
  unknown: I18N.SOMETHING_WENT_WRONG,
};

export const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PaymentFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const { data, error, isFetching } = usePayments({
    page,
    pageSize: PAGE_SIZE,
    ...filters,
  });

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const errorMessage = error ? ERROR_MESSAGES[error.type] : null;

  const updateFilters = (changes: Partial<PaymentFilters>) => {
    setFilters((current) => ({ ...current, ...changes }));
    setPage(DEFAULT_PAGE);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters(INITIAL_FILTERS);
    setPage(DEFAULT_PAGE);
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
        <PaymentsTable
          payments={data?.payments ?? []}
          isLoading={isFetching}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: data?.total ?? 0,
            onPageChange: setPage,
          }}
        />
      )}
    </Container>
  );
};
