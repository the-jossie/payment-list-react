import { I18N } from "../../constants/i18n";
import { hasNextPage, hasPreviousPage } from "../lib/pagination";
import { PaginationButton, PaginationRow } from "./styles";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, pageSize, total, onPageChange }: PaginationProps) => (
  <PaginationRow role="navigation" aria-label={I18N.PAGINATION_LABEL}>
    <PaginationButton
      type="button"
      onClick={() => onPageChange(page - 1)}
      disabled={!hasPreviousPage(page)}
    >
      {I18N.PREVIOUS_BUTTON}
    </PaginationButton>
    <span aria-live="polite">
      {I18N.PAGE_LABEL} {page}
    </span>
    <PaginationButton
      type="button"
      onClick={() => onPageChange(page + 1)}
      disabled={!hasNextPage(page, pageSize, total)}
    >
      {I18N.NEXT_BUTTON}
    </PaginationButton>
  </PaginationRow>
);
