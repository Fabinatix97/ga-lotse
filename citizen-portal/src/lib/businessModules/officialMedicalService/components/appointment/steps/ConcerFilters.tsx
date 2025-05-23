/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { SelectOptions } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/official-medical-service-api";

import {
  SEARCH_PARAMS,
  useConcernFilterValues,
} from "@/lib/businessModules/officialMedicalService/components/appointment/steps/useConcernFilterValues";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  SearchParamReplacement,
  useReplaceSearchParams,
} from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

interface ConcernFilterProps {
  allConcerns: ApiConcern[];
}
export function ConcernFilters({ allConcerns }: Readonly<ConcernFilterProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  const filterValues = useConcernFilterValues();
  const replaceSearchParams = useReplaceSearchParams();

  function updateFilterValue(replacement: SearchParamReplacement[]) {
    replaceSearchParams([...replacement]);
  }

  function onChangeCategory(newValue: string | null) {
    updateFilterValue([{ name: SEARCH_PARAMS.category, value: newValue }]);
  }

  return (
    <Stack gap={0.5}>
      <Typography level="title-sm" component="label">
        {t("concern.filter.category")}
      </Typography>
      <Select
        aria-label={t("concern.filter.category")}
        value={filterValues.category ?? ""}
        sx={{
          height: "40px",
          width: byBreakpoint({ mobile: "100%", desktop: "220px" }),
        }}
        onChange={(event, value) => {
          if (event !== null) {
            onChangeCategory(value);
          }
        }}
      >
        <SelectOptions options={useConcernOptions(allConcerns)} />
      </Select>
    </Stack>
  );
}

function useConcernOptions(allConcerns: ApiConcern[]) {
  const { t, i18n } = useTranslation(["officialMedicalService/appointment"]);

  const uniqueCategory = [
    ...new Set(
      allConcerns
        .map((item) => {
          return {
            categoryNameDe: item.categoryNameDe,
            categoryNameEn: item.categoryNameEn ?? "",
          };
        })
        .map((i) =>
          allConcerns.find(
            (concern) => concern.categoryNameDe === i.categoryNameDe,
          ),
        ),
    ),
  ];

  const options = [{ value: "", label: t("concern.filter.category_all") }];
  Object.values(uniqueCategory).forEach((concern) => {
    if (isDefined(concern)) {
      options.push({
        value: concern.categoryNameDe,
        label:
          isDefined(concern.categoryNameEn) && i18n.language === "en"
            ? concern.categoryNameEn
            : concern.categoryNameDe,
      });
    }
  });

  return options;
}
