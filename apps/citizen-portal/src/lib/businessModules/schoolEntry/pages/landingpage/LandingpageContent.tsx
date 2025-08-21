/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { formatStreetAndHouseNumber } from "@eshg/lib-portal";

import { useSchoolEntryPublicCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import {
  getDepartmentInfoQuery,
  getOpeningHoursQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/publicCitizenApi";
import { useTranslation } from "@/lib/i18n/client";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingpageContent() {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const publicCitizenApi = useSchoolEntryPublicCitizenApi();
  const [{ data: openingHours }, { data: departmentInfo }] = useSuspenseQueries(
    {
      queries: [
        getOpeningHoursQuery(publicCitizenApi),
        getDepartmentInfoQuery(publicCitizenApi),
      ],
    },
  );

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <Typography>{t("information.invitation")}</Typography>
        <Typography>{t("information.cancellation")}</Typography>
        <Typography>
          {t("information.location", {
            address: formatStreetAndHouseNumber(departmentInfo),
          })}
        </Typography>
      </ContentSheet>
      <ContactAndAvailabilitySheet
        openingHoursSectionProps={{
          openingHourTranslations: openingHours,
        }}
        departmentInfo={departmentInfo}
      />
    </GridColumnStack>
  );
}
