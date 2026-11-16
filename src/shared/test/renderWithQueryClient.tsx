import { ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "../lib/queryClient";

export const renderWithQueryClient = (ui: ReactElement) =>
  render(
    <QueryClientProvider client={createQueryClient()}>{ui}</QueryClientProvider>
  );
