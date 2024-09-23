/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Updater } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { isFunction } from "remeda";

import { SearchFilter } from "@/lib/components/table/SearchFilter";
import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";
import { useTranslation } from "@/lib/i18n/client";

export function useGlobalFilter() {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const GLOBAL_FILTER = "global-filter";
  const globalFilter = useMemo(
    () => searchParams.get(GLOBAL_FILTER) ?? "",
    [searchParams],
  );
  const onGlobalFilterChange = useCallback(
    (updater: Updater<string>) => {
      const value: string = isFunction(updater)
        ? updater(globalFilter)
        : updater;
      replaceSearchParams([{ name: GLOBAL_FILTER, value }]);
    },
    [globalFilter, replaceSearchParams],
  );
  const { t } = useTranslation();
  const globalFilterInputElement = (
    <SearchFilter searchParamName={GLOBAL_FILTER} label={t("fullTextSearch")} />
  );
  return { globalFilter, onGlobalFilterChange, globalFilterInputElement };
}
