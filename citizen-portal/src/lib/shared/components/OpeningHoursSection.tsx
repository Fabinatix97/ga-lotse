/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetOpeningHoursResponse } from "@eshg/travel-medicine-api";
import { AccessTimeOutlined } from "@mui/icons-material";
import { Stack, Typography, styled } from "@mui/joy";
import { Fragment } from "react";
import { isDefined, map, partition, pipe, zip } from "remeda";

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

  const hasOpeningHours = isDefined(openingHours);
  let openingHoursInSelectedLanguage: string[] = [];
  let additionalInformation;

  if (hasOpeningHours) {
    if (i18n.language === "de") {
      openingHoursInSelectedLanguage = openingHours.de;
    } else {
      openingHoursInSelectedLanguage = openingHours.en;
    }

    const openingHoursLength = openingHoursInSelectedLanguage.length;
    if (openingHoursLength % 2 !== 0) {
      additionalInformation =
        openingHoursInSelectedLanguage[openingHoursLength - 1];
    }
  }
  const [periods, availabilities] = partition(
    openingHoursInSelectedLanguage.length > 1
      ? openingHoursInSelectedLanguage
      : [],
    (_, index) => index % 2 === 0,
  );
  const pairedAvailability = pipe(
    periods,
    zip(availabilities),
    map(
      ([period, availability]) => [period, availability.split("\n")] as const,
    ),
  );
  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>
        {t("contact.opening_hours_section.title")}
      </InfoSectionTitle>
      {hasOpeningHours ? (
        <>
          <Stack component="dl" sx={{ margin: 0 }}>
            {pairedAvailability.map(([period, availabilities]) => (
              <OpeningTime
                key={period}
                period={period}
                availabilities={availabilities}
              />
            ))}
          </Stack>
          {additionalInformation && (
            <Typography>{additionalInformation}</Typography>
          )}
        </>
      ) : (
        <Typography>
          {t("contact.opening_hours_section.information")}
        </Typography>
      )}
    </InfoSection>
  );
}

const OpeningTimePair = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: theme.spacing(2),
  margin: 0,
}));

function OpeningTime({
  period,
  availabilities,
}: {
  period: string;
  availabilities: string[];
}) {
  return (
    <OpeningTimePair>
      <Typography component="dt" sx={{ marginRight: 1 }}>
        {period}
      </Typography>
      <Typography component="dd" sx={{ margin: 0 }}>
        {availabilities.map((t, index) => (
          <Fragment key={t}>
            {t}
            {index !== availabilities.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </Typography>
    </OpeningTimePair>
  );
}
