import { I18N } from "../constants/i18n";
import { usePayments } from "../hooks/usePayments";
import { Container, Title } from "./components";
import { PaymentsTable } from "./PaymentsTable";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 5;

export const PaymentsPage = () => {
  const { data, isFetching } = usePayments({ page: DEFAULT_PAGE, pageSize: PAGE_SIZE });

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsTable
        payments={data?.payments ?? []}
        isLoading={isFetching}
      />
    </Container>
  );
};
