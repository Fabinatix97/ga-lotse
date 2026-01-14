/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography, styled } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

const Std = styled("td")`
  text-align: center;
`;

export function EmptyTableHint({
  empty,
  allFiltered,
  columns,
}: {
  empty: boolean;
  allFiltered: boolean;
  columns: number;
}) {
  const { t } = useTranslation();
  return empty ? (
    <tr>
      <Std colSpan={columns}>
        <Typography fontStyle="italic">{t("emptyTableHint")}</Typography>
      </Std>
    </tr>
  ) : (
    allFiltered && (
      <tr>
        <Std colSpan={columns}>
          <Typography fontStyle="italic">
            {t("allFilteredTableHint")}
          </Typography>
        </Std>
      </tr>
    )
  );
}
