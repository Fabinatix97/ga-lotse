/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FmdGoodOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

interface AddressSectionProps {
  department: ApiGetDepartmentInfoResponse;
}

export function AddressSection({ department }: Readonly<AddressSectionProps>) {
  const { t } = useTranslation(["shared/addressSection"]);

  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>{t("title")}</InfoSectionTitle>
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
