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

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return I18N.SOMETHING_WENT_WRONG;

  switch (error.response?.status) {
    case HttpStatusCode.NotFound:
      return I18N.PAYMENT_NOT_FOUND;
    case HttpStatusCode.InternalServerError:
      return I18N.INTERNAL_SERVER_ERROR;
    default:
      return I18N.SOMETHING_WENT_WRONG;
  }
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
  const errorMessage = error ? getErrorMessage(error) : null;

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
