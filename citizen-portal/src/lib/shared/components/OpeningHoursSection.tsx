/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessTimeOutlined } from "@mui/icons-material";
import { Stack, Typography, styled } from "@mui/joy";
import { Fragment } from "react";
import { isDefined, map, partition, pipe, splitAt, zip } from "remeda";

import { ApiGetOpeningHoursResponse } from "@eshg/travel-medicine-api";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import { useManualTranslation } from "@/lib/shared/hooks/useManualTranslation";

interface OpeningHoursSectionProps {
  openingHours?: ApiGetOpeningHoursResponse;
  localePath: string;
}

export function OpeningHoursSection({
  openingHours,
  localePath,
}: Readonly<OpeningHoursSectionProps>) {
  const { t } = useTranslation([`${localePath}`]);

  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>
        {t("contact.opening_hours_section.title")}
      </InfoSectionTitle>
      {isDefined(openingHours) ? (
        <OpeningHourStack openingHours={openingHours} />
      ) : (
        <Typography>
          {t("contact.opening_hours_section.information")}
        </Typography>
      )}
    </InfoSection>
  );
}

function OpeningHourStack({
  openingHours,
}: {
  openingHours: ApiGetOpeningHoursResponse;
}) {
  const translatedOpeningHours = useManualTranslation({
    de: openingHours.de,
    en: openingHours.en,
  });

  // If the length is odd, the last element is additional information
  const [lines, [additionalInformation]] =
    translatedOpeningHours.length % 2 !== 0
      ? splitAt(translatedOpeningHours, -1)
      : [translatedOpeningHours, []];

  const pairedAvailability = pipe(
    lines,
    // ["Mo", "9:00", "Di", "10:00"] => [["Mo", "Di"], ["9:00", "10:00"]]
    partition((_, index) => index % 2 === 0),
    // [["Mo", "Di"], ["9:00", "10:00"]] => [["Mo", "9:00"], ["Di", "10:00"]]
    ([periods, availabilities]) => zip(periods, availabilities),
    // split availabilities by "\n" to later insert line breaks
    map(
      ([period, availability]) => [period, availability.split("\n")] as const,
    ),
  );

  return (
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
  );
}

const OpeningTimePair = styled("div")(({ theme }) => ({
  display: "grid",
  // auto because not all modules are formatted the same way
  gridTemplateColumns: "auto auto",
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
        {availabilities.map((text, index) => (
          <Fragment key={text}>
            {text}
            {index !== availabilities.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </Typography>
    </OpeningTimePair>
  );
}
