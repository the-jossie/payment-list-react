import { Key, ReactNode } from "react";
import {
  TableWrapper,
  Table,
  TableHeaderWrapper,
  TableHeaderRow,
  TableHeader,
  TableBodyWrapper,
  TableRow,
  TableCell,
} from "./components";

export interface TableColumn<T> {
  key: string;
  value: ReactNode;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => Key;
  isLoading?: boolean;
}

export const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
}: DataTableProps<T>) => (
  <TableWrapper>
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
  </TableWrapper>
);
