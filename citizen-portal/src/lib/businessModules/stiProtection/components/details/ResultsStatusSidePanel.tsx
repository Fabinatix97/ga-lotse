/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { GoToChangePinCard } from "@/lib/businessModules/stiProtection/components/pin/GoToChangePinCard";
import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ColumnGridSidePanel } from "@/lib/shared/components/layout/grid";

export function ResultsStatusSidePanel() {
  const { t } = useTranslation("stiProtection/resultsStatus");
  const { data: procedure } = useGetProcedure();
  const citizenRoutes = useConcernedCitizenRoutes(procedure.concern);
  const {
    data: { hasResults },
  } = useGetProcedure();

  const messageKey = hasResults ? "get_results" : "still_no_results";

  return (
    <ColumnGridSidePanel>
      <ContentSheet>
        <ContentSheetTitle>{t(`view.${messageKey}_title`)}</ContentSheetTitle>
        <Typography>{t(`view.${messageKey}_body`)}</Typography>
        {hasResults ? (
          <InternalLinkButton href={citizenRoutes.personalArea.appointments}>
            {t("view.go_to_appointments")}
          </InternalLinkButton>
        ) : null}
      </ContentSheet>
      <GoToChangePinCard />
    </ColumnGridSidePanel>
  );
}
