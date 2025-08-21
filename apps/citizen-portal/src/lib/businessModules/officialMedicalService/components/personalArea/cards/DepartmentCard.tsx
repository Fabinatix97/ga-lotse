/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChatBubbleOutlineOutlined,
  FmdGoodOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Trans } from "react-i18next";

import {
  ExternalLink,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@eshg/lib-portal";

import { useGetDepartmentInfoQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function DepartmentCard() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const [{ data: department }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery()],
  });

  return (
    <ContentSheet data-testid="department-card">
      <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
      <InfoSectionGrid>
        <DetailsItem
          label={t("contact.address_section.title")}
          value={
            <Trans
              i18nKey="contact.addressSection.value"
              ns="officialMedicalService/personalArea"
              values={{
                departmentName: department.name,
                departmentStreetAndHouseNumber:
                  formatStreetAndHouseNumber(department),
                departmentPostalCodeAndCity:
                  formatPostalCodeAndCity(department),
              }}
            />
          }
          icon={<FmdGoodOutlined />}
        />
        <DetailsItem
          label={t("contact.contactSection.title")}
          value={
            <Stack direction="column" gap={0.5}>
              <Typography>
                {t("contact.contactSection.phoneNumber", {
                  phoneNumber: department.phoneNumber,
                })}
              </Typography>
              <Typography>
                {t("contact.contactSection.eMail")}
                {`\u00A0`}
                <ExternalLink
                  sx={{ wordBreak: "break-all" }}
                  href={`mailto:${department.email}`}
                >
                  {department.email}
                </ExternalLink>
              </Typography>
            </Stack>
          }
          slotProps={{
            value: { component: "div" },
          }}
          icon={<ChatBubbleOutlineOutlined />}
        />
      </InfoSectionGrid>
    </ContentSheet>
  );
}
