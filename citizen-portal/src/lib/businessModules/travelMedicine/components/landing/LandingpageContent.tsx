/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import {
  AccessTimeOutlined,
  ChatBubbleOutlineOutlined,
  FmdGoodOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useGetDepartmentInfo } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import {
  TableListing,
  TableListingRow,
} from "@/lib/shared/components/tableListing";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";
import { DepartmentInfoProps } from "@/lib/shared/types";

export function LandingpageContent() {
  const { t } = useTranslation(["travelMedicine/landing"]);
  const { data: department } = useGetDepartmentInfo();

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection department={department} />
          <ContactDataSection department={department} />
        </InfoSectionGrid>
        <OpeningHoursSection />
      </ContentSheet>
    </GridColumnStack>
  );
}

function AddressSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["travelMedicine/landing"]);

  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>{t("contact.address")}</InfoSectionTitle>
      <Typography>
        {props.department.name}
        <br />
        {formatStreetAndHouseNumber(props.department)}
        <br />
        {formatPostalCodeAndCity(props.department)}
      </Typography>
    </InfoSection>
  );
}

function OpeningHoursSection() {
  const { t } = useTranslation(["travelMedicine/landing"]);

  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>{t("contact.openingHours")}</InfoSectionTitle>
      <TableListing>
        <tr>
          <td colSpan={2} style={{ paddingBottom: 3 }}>
            {t("contact.consultationHours")}
          </td>
        </tr>
        <TableListingRow label={t("contact.moDoLabel")}>
          {t("contact.moDoValue")}
        </TableListingRow>
        <tr>
          <td colSpan={2} style={{ paddingTop: 3, paddingBottom: 3 }}>
            {t("contact.telephoneBooking")}
          </td>
        </tr>
        <TableListingRow label={t("contact.moMiLabel")}>
          {t("contact.moMiValue")}
        </TableListingRow>
        <TableListingRow label={t("contact.frLabel")}>
          {t("contact.frValue")}
        </TableListingRow>
      </TableListing>
    </InfoSection>
  );
}

function ContactDataSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["travelMedicine/landing"]);

  return (
    <InfoSection icon={<ChatBubbleOutlineOutlined />}>
      <InfoSectionTitle>{t("contact.contact")}</InfoSectionTitle>
      <Typography>
        {t("contact.phoneNumber", {
          phoneNumber: props.department.phoneNumber,
        })}
      </Typography>
      <Typography display="inline">
        {t("contact.eMail")}
        {`\u00A0`}
        <ExternalLink href={`mailto:${props.department.email}`}>
          {props.department.email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}
