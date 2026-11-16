import { useState } from "react";
import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { Container, Title } from "./components";
import { PaymentsSearch } from "./PaymentsSearch";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

export const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const { data, isFetching } = usePayments({
    page: DEFAULT_PAGE,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsSearch onSearch={setSearch} />
      <PaymentsTable
        payments={data?.payments ?? []}
        isLoading={isFetching}
      />
    </Container>
  );
};
