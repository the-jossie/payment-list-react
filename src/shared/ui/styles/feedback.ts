import styled from "styled-components";

export type BadgeTone = "success" | "warning" | "danger" | "neutral";

const BADGE_TONE_STYLES: Record<BadgeTone, string> = {
  success: "background-color: #d1fae5; color: #15803d;",
  warning: "background-color: #fef3c7; color: #92400e;",
  danger: "background-color: #fee2e2; color: #b91c1c;",
  neutral: "background-color: #e5e7eb; color: #374151;",
};

export const StatusBadge = styled.span<{ $tone: BadgeTone }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  ${({ $tone }) => BADGE_TONE_STYLES[$tone]}
`;

export const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorBox = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  color: #b91c1c;
  background-color: #fee2e2;
  border-radius: 0.375rem;
`;

export const EmptyBox = styled.div`
  color: #4b5563;
  text-align: center;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
`;
