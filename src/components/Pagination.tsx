import { I18N } from "../constants/i18n";
import { PaginationButton, PaginationRow } from "./components";

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
}

export const Pagination = ({
  page,
  onPageChange,
  isPreviousDisabled = page <= 1,
  isNextDisabled = false,
}: PaginationProps) => (
  <PaginationRow role="navigation" aria-label={I18N.PAGINATION_LABEL}>
    <PaginationButton
      type="button"
      onClick={() => onPageChange(page - 1)}
      disabled={isPreviousDisabled}
      aria-label={I18N.PREVIOUS_BUTTON}
    >
      {I18N.PREVIOUS_BUTTON}
    </PaginationButton>
    <span aria-live="polite" aria-label={I18N.PAGE_LABEL + " " + page}>
      {I18N.PAGE_LABEL} {page}
    </span>
    <PaginationButton
      type="button"
      onClick={() => onPageChange(page + 1)}
      disabled={isNextDisabled}
      aria-label={I18N.NEXT_BUTTON}
    >
      {I18N.NEXT_BUTTON}
    </PaginationButton>
  </PaginationRow>
);
