import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  margin-top: 1.5rem;
`;

export const TableScroll = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  min-width: 100%;
  font-size: 14px;
  text-align: left;
`;

export const TableHeaderWrapper = styled.thead`
  background-color: #f9fafb;
`;

export const TableHeaderRow = styled.tr`
  border-bottom: 2px solid #e5e7eb;
`;

export const TableHeader = styled.th`
  padding: 1rem;
  font-weight: 600;
  background-color: #f3f4f6;
`;

export const TableBodyWrapper = styled.tbody`
  background-color: white;
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

export const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
`;

export const PaginationButton = styled.button`
  padding: 0.25rem 0.75rem;
  white-space: nowrap;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
