/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FmdGoodOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";

interface AddressSectionProps {
  department: ApiGetDepartmentInfoResponse;
  localePath: string;
}

export function AddressSection({
  department,
  localePath,
}: Readonly<AddressSectionProps>) {
  const { t } = useTranslation([`${localePath}`]);

  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>{t("contact.address_section.title")}</InfoSectionTitle>
      <Typography>
        {department.name}
        <br />
        {formatStreetAndHouseNumber(department)}
        <br />
        {formatPostalCodeAndCity(department)}
      </Typography>
    </InfoSection>
  );
}
