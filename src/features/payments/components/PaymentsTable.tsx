import { I18N } from "../../../constants/i18n";
import { Payment } from "../types";
import { formatAmount, formatDate } from "../../../shared/lib/format";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { DataTable, TableColumn } from "../../../shared/ui/DataTable";
import { PaginationProps } from "../../../shared/ui/Pagination";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
  pagination?: PaginationProps;
}

const PAYMENT_COLUMNS: TableColumn<Payment>[] = [
  { key: "id", value: I18N.TABLE_HEADER_PAYMENT_ID, render: (p) => p.id },
  {
    key: "date",
    value: I18N.TABLE_HEADER_DATE,
    render: (p) => formatDate(p.date),
  },
  {
    key: "amount",
    value: I18N.TABLE_HEADER_AMOUNT,
    render: (p) => formatAmount(p.amount),
  },
  {
    key: "customer",
    value: I18N.TABLE_HEADER_CUSTOMER,
    render: (p) => p.customerName || I18N.EMPTY_CUSTOMER,
  },
  {
    key: "currency",
    value: I18N.TABLE_HEADER_CURRENCY,
    render: (p) => p.currency || I18N.EMPTY_CURRENCY,
  },
  {
    key: "status",
    value: I18N.TABLE_HEADER_STATUS,
    render: (p) => <PaymentStatusBadge status={p.status} />,
  },
];

export const PaymentsTable = ({
  payments,
  isLoading,
  pagination,
}: PaymentsTableProps) => (
  <DataTable
    columns={PAYMENT_COLUMNS}
    rows={payments}
    getRowKey={(p) => p.id}
    isLoading={isLoading}
    emptyMessage={I18N.NO_PAYMENTS_FOUND}
    pagination={pagination}
  />
);
