/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiLandingElementHeaderConfig,
  ApiLandingElementListConfig,
} from "@eshg/official-medical-service-api";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  useGetLandingContent,
  useGetOpeningHoursQuery,
} from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { OpeningHoursSection } from "@/lib/businessModules/officialMedicalService/shared/components/OpeningHoursSection";
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

interface LandingpageContentProps {
  departmentInfo: DepartmentInfo;
}

export function LandingpageContent(props: Readonly<LandingpageContentProps>) {
  const { t, i18n } = useTranslation(["officialMedicalService/landing"]);
  const [{ data: openingHours }, { data: landingContent }] = useSuspenseQueries(
    {
      queries: [useGetOpeningHoursQuery(), useGetLandingContent()],
    },
  );

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        {landingContent.elements.map((element) => (
          <Stack gap={0.5} key={element.elementHeader.de}>
            <Typography level={"title-md"} sx={{ whiteSpace: "pre-wrap" }}>
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
