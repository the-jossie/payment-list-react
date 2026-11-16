import { isPaymentStatus, PaymentStatus } from "../types";
import { BadgeTone, StatusBadge } from "../../../shared/ui/styles";

const STATUS_TONES: Record<PaymentStatus, BadgeTone> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
  refunded: "danger",
};

interface PaymentStatusBadgeProps {
  status: string;
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const tone = isPaymentStatus(status) ? STATUS_TONES[status] : "neutral";
  return <StatusBadge $tone={tone}>{status}</StatusBadge>;
};
