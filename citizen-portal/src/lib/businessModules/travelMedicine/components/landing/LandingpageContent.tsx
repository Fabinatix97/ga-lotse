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
  const { data: department } = useGetDepartmentInfo();

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>Kontakt und Erreichbarkeit</ContentSheetTitle>
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
  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>Adresse</InfoSectionTitle>
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
  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>Öffnungszeiten</InfoSectionTitle>
      <TableListing>
        <tr>
          <td colSpan={2} style={{ paddingBottom: 3 }}>
            Sprechzeiten nur nach Terminvereinbarung (telefonisch oder per
            E-Mail)
          </td>
        </tr>
        <TableListingRow label="Mo bis Do">08:00 bis 12:00 Uhr</TableListingRow>
        <tr>
          <td colSpan={2} style={{ paddingTop: 3, paddingBottom: 3 }}>
            Telefonische Terminvereinbarung
          </td>
        </tr>
        <TableListingRow label="Mo bis Mi">14:00 bis 15:00 Uhr</TableListingRow>
        <TableListingRow label="Fr">08:00 bis 10:00 Uhr</TableListingRow>
      </TableListing>
    </InfoSection>
  );
}

function ContactDataSection(props: DepartmentInfoProps) {
  return (
    <InfoSection icon={<ChatBubbleOutlineOutlined />}>
      <InfoSectionTitle>Kontakt</InfoSectionTitle>
      <Typography>Telefon: {props.department.phoneNumber}</Typography>
      <Typography display="inline">
        E-Mail:{`\u00A0`}
        <ExternalLink href={`mailto:${props.department.email}`}>
          {props.department.email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}
