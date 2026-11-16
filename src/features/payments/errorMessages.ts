import { I18N } from "../../constants/i18n";
import { ApiErrorType } from "../../shared/api/ApiError";

const PAYMENTS_ERROR_MESSAGES: Record<ApiErrorType, string> = {
  "not-found": I18N.PAYMENT_NOT_FOUND,
  server: I18N.INTERNAL_SERVER_ERROR,
  unknown: I18N.SOMETHING_WENT_WRONG,
};

export const getPaymentsErrorMessage = (type: ApiErrorType): string =>
  PAYMENTS_ERROR_MESSAGES[type];
