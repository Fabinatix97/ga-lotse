/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Trans } from "react-i18next";

import { useGetOpeningHoursQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { OpeningHoursSection } from "@/lib/businessModules/officialMedicalService/shared/components/OpeningHoursSection";
import { TranslatedList } from "@/lib/businessModules/officialMedicalService/shared/components/TranslatedList";
import { useTranslation } from "@/lib/i18n/client";
import { DepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { EmailSection } from "@/lib/shared/components/EmailSection";
import { PhoneSection } from "@/lib/shared/components/PhoneSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { formatDepartmentAddress } from "@/lib/shared/formatters/address";

interface LandingpageContentProps {
  departmentInfo: DepartmentInfo;
}

export function LandingpageContent(props: Readonly<LandingpageContentProps>) {
  const { t } = useTranslation(["officialMedicalService/landing"]);
  const [{ data: openingHours }] = useSuspenseQueries({
    queries: [useGetOpeningHoursQuery()],
  });

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <Alert color={"primary"} message={t("information.infoText")} />
        <Typography level="body-md" fontWeight="bold">
          <Trans
            i18nKey="information.pleaseComeDepartment"
            ns="officialMedicalService/landing"
            values={{
              department: formatDepartmentAddress(props.departmentInfo),
            }}
          />
        </Typography>
        <Stack gap={0.5}>
          <Typography level={"title-md"}>
            {t("information.pleaseBring_heading")}
          </Typography>
          <TranslatedList
            ns="officialMedicalService/landing"
            translationKey="information.pleaseBring_list"
          />
        </Stack>
        <Stack gap={0.5}>
          <Typography level={"title-md"}>
            {t("information.forAttests_heading")}
          </Typography>
          <TranslatedList
            ns="officialMedicalService/landing"
            translationKey="information.forAttests_list"
          />
        </Stack>
        <Stack gap={0.5}>
          <Typography level={"title-md"}>
            {t("information.definitelyBring_heading")}
          </Typography>
          <TranslatedList
            component="ol"
            marker="decimal"
            ns="officialMedicalService/landing"
            translationKey="information.definitelyBring_list"
          />
        </Stack>
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection
            department={props.departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <PhoneSection
            department={props.departmentInfo}
            localePath="officialMedicalService/landing"
          ></PhoneSection>
          <OpeningHoursSection
            openingHours={openingHours}
            localePath="officialMedicalService/landing"
          />
          <EmailSection
            department={props.departmentInfo}
            localePath="officialMedicalService/landing"
          ></EmailSection>
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}
