import { isPaymentStatus, PaymentStatus } from "../types/payment";
import { BadgeTone, StatusBadge } from "./components";

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
