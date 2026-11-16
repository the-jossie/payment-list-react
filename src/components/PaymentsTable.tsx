import { I18N } from "../constants/i18n";
import { Payment } from "../types/payment";
import { formatAmount, formatDate } from "../utils/format";
import { StatusBadge } from "./components";
import { TableColumn, DataTable } from "./DataTable";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
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
    render: (p) => <StatusBadge status={p.status}>{p.status}</StatusBadge>,
  },
];

export const PaymentsTable = ({ payments, isLoading }: PaymentsTableProps) => (
  <DataTable
    columns={PAYMENT_COLUMNS}
    rows={payments}
    getRowKey={(p) => p.id}
    isLoading={isLoading}
  />
);
