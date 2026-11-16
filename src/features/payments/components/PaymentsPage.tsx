import { I18N } from "../../../constants/i18n";
import { Container, ErrorBox, Title } from "../../../shared/ui/styles";
import { PAGE_SIZE } from "../constants";
import { getPaymentsErrorMessage } from "../errorMessages";
import { usePaymentFilters } from "../hooks/usePaymentFilters";
import { usePayments } from "../hooks/usePayments";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

export const PaymentsPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    page,
    setPage,
  } = usePaymentFilters();

  const { data, error, isFetching } = usePayments({
    page,
    pageSize: PAGE_SIZE,
    ...filters,
  });

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
      {error ? (
        <ErrorBox role="alert">{getPaymentsErrorMessage(error.type)}</ErrorBox>
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
