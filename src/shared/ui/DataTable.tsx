import { Key, ReactNode } from "react";
import {
  EmptyBox,
  Spinner,
  TableWrapper,
  TableScroll,
  Table,
  TableHeaderWrapper,
  TableHeaderRow,
  TableHeader,
  TableBodyWrapper,
  TableRow,
  TableCell,
} from "./styles";
import { I18N } from "../../constants/i18n";
import { Pagination } from "./Pagination";

export interface TableColumn<T> {
  key: string;
  value: ReactNode;
  render: (row: T) => ReactNode;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => Key;
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  pagination?: TablePagination;
}

export const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  emptyMessage,
  pagination,
}: DataTableProps<T>) => {
  const renderState = () => {
    if (rows.length > 0) return null;

    if (isLoading) {
      return (
        <EmptyBox>
          <Spinner role="status" aria-label={I18N.LOADING} />
        </EmptyBox>
      );
    }

    if (emptyMessage) return <EmptyBox>{emptyMessage}</EmptyBox>;

    return null;
  };

  return (
    <TableWrapper>
      <TableScroll>
        <Table aria-busy={isLoading}>
          <TableHeaderWrapper>
            <TableHeaderRow>
              {columns.map((column) => (
                <TableHeader key={column.key} scope="col">
                  {column.value}
                </TableHeader>
              ))}
            </TableHeaderRow>
          </TableHeaderWrapper>
          <TableBodyWrapper>
            {rows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column) => (
                  <TableCell key={`cell-${getRowKey(row)}-${column.key}`}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBodyWrapper>
        </Table>
      </TableScroll>
      {renderState()}
      {pagination && (
        <Pagination
          page={pagination.page}
          onPageChange={pagination.onPageChange}
          isNextDisabled={
            pagination.page * pagination.pageSize >= pagination.total
          }
        />
      )}
    </TableWrapper>
  );
};
