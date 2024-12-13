/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetOpeningHoursResponse } from "@eshg/citizen-portal-api/travelMedicine";
import { AccessTimeOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

interface OpeningHoursSectionProps {
  openingHours?: ApiGetOpeningHoursResponse;
  localePath: string;
}

export function OpeningHoursSection({
  openingHours,
  localePath,
}: Readonly<OpeningHoursSectionProps>) {
  const { t, i18n } = useTranslation([`${localePath}`]);

  let openingHoursInSelectedLanguage;
  if (isDefined(openingHours)) {
    if (i18n.language === "de") {
      openingHoursInSelectedLanguage = openingHours.de;
    } else {
      openingHoursInSelectedLanguage = openingHours.en;
    }
  }

  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>
        {t("contact.openingHoursSection.title")}
      </InfoSectionTitle>
      {openingHours && openingHoursInSelectedLanguage ? (
        openingHoursInSelectedLanguage.map((openingHour) => (
          <Typography sx={{ margin: 0 }} key={openingHour}>
            {openingHour}
          </Typography>
        ))
      ) : (
        <Typography>{t("contact.openingHoursSection.information")}</Typography>
      )}
    </InfoSection>
  );
}
