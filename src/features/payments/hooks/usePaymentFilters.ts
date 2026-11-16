import { useState } from "react";
import { DEFAULT_PAGE } from "../constants";
import { PaymentFilters } from "../types";

const INITIAL_FILTERS: PaymentFilters = {
  search: "",
  currency: "",
};

export const usePaymentFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PaymentFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(DEFAULT_PAGE);

  const updateFilters = (changes: Partial<PaymentFilters>) => {
    setFilters((current) => ({ ...current, ...changes }));
    setPage(DEFAULT_PAGE);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters(INITIAL_FILTERS);
    setPage(DEFAULT_PAGE);
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters: Object.values(filters).some(Boolean),
    page,
    setPage,
  };
};
