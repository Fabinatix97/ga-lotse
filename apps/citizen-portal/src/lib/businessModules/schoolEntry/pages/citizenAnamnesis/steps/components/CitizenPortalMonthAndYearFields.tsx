/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import {
  MonthAndYearFieldsProps,
  NumberField,
  SelectObjectField,
  useMonthAndYearValidationsRules,
} from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";

export function CitizenPortalMonthAndYearFields(
  props: Omit<MonthAndYearFieldsProps, "monthLabel" | "yearLabel">,
) {
  const { t } = useTranslation("schoolEntry/anamnesis");
  const monthValues = [
    t("months.jan"),
    t("months.feb"),
    t("months.mar"),
    t("months.apr"),
    t("months.may"),
    t("months.jun"),
    t("months.jul"),
    t("months.aug"),
    t("months.sep"),
    t("months.oct"),
    t("months.nov"),
    t("months.dec"),
  ];

  const { month, year } = useMonthAndYearValidationsRules(props.fieldName);

  return (
    <Grid
      container
      spacing={2}
      role="group"
      aria-labelledby={props["aria-labelledby"]}
    >
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        <SelectObjectField
          options={monthValues.map((_, i) => i)}
          getOptionLabel={(option: number): string =>
            monthValues.at(option) ?? ""
          }
          name={`${props.fieldName}.month`}
          label={t("month")}
          required={month.required}
          validate={month.validate}
        />
      </Grid>
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        <NumberField
          name={`${props.fieldName}.year`}
          label={t("year")}
          required={year.required}
          validate={year.validate}
        />
      </Grid>
    </Grid>
  );
}
