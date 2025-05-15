/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  ApiLandingElementHeaderConfig,
  ApiLandingElementListConfig,
} from "@eshg/official-medical-service-api";

import {
  useGetDepartmentInfoQuery,
  useGetLandingContent,
  useGetOpeningHoursQuery,
} from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { EmailSection } from "@/lib/shared/components/EmailSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
import { PhoneSection } from "@/lib/shared/components/PhoneSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingpageContent() {
  const { t, i18n } = useTranslation(["officialMedicalService/landing"]);
  const [
    { data: departmentInfo },
    { data: openingHours },
    { data: landingContent },
  ] = useSuspenseQueries({
    queries: [
      useGetDepartmentInfoQuery(),
      useGetOpeningHoursQuery(),
      useGetLandingContent(),
    ],
  });

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        {landingContent.elements.map((element) => (
          <Stack key={element.elementHeader.de} gap={0.5}>
            <Typography level="title-md" sx={{ whiteSpace: "pre-wrap" }}>
              {
                element.elementHeader[
                  i18n.language as keyof ApiLandingElementHeaderConfig
                ]
              }
            </Typography>
            {isDefined(element.elementList) && (
              <List
                marker="disc"
                component="ul"
                sx={{
                  "--List-gap:": "0.5px",
                  "--ListItem-minHeight:": 0,
                  "--ListItem-paddingY:": 0,
                  "--ListDivider-gap:": 0,
                  "--ListItem-paddingLeft:": 0,
                }}
              >
                {element.elementList[
                  i18n.language as keyof ApiLandingElementListConfig
                ].map((item, index) => (
                  <ListItem key={`${item}.${index}`}>{item}</ListItem>
                ))}
              </List>
            )}
          </Stack>
        ))}
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection
            department={departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <PhoneSection
            department={departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <OpeningHoursSection
            openingHours={openingHours}
            localePath="officialMedicalService/landing"
          />
          <EmailSection
            department={departmentInfo}
            localePath="officialMedicalService/landing"
          />
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}
