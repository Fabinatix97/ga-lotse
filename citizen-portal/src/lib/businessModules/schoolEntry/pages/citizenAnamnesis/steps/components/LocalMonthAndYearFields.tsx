/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MonthAndYearFields,
  MonthAndYearFieldsProps,
} from "@eshg/lib-portal/components/formFields/MonthAndYearFields";

import { useTranslation } from "@/lib/i18n/client";

export function LocalMonthAndYearFields(
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
  return (
    <MonthAndYearFields
      {...props}
      monthLabel={t("month")}
      yearLabel={t("year")}
      monthValues={monthValues}
    />
  );
}
