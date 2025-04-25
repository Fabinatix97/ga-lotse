/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AccessTimeOutlined } from "@mui/icons-material";
import { Grid, Stack, Typography, styled } from "@mui/joy";
import { isDefined, map, partition, pipe, zip } from "remeda";

import { ApiGetOpeningHoursResponse } from "@eshg/official-medical-service-api";

import { useManualTranslation } from "@/lib/businessModules/officialMedicalService/shared/useManualTranslation";
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
  const { t } = useTranslation([`${localePath}`]);

  const openingHoursInSelectedLanguage = useManualTranslation({
    de: openingHours?.de,
    en: openingHours?.en,
  });

  const [periods, availabilities] = partition(
    openingHoursInSelectedLanguage ?? [],
    (item) => item.includes("|"),
  );

  const pairedAvailability = pipe(
    periods,
    zip(availabilities),
    map(([period, availability]) => {
      return {
        periods: period.split("\n").map((i) => i.split(" | ")),
        availability: availability,
      };
    }),
  );

  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>
        {t("contact.opening_hours_section.title")}
      </InfoSectionTitle>
      {isDefined(openingHours) ? (
        <Stack sx={{ margin: 0, gap: 1 }} component="dl">
          {pairedAvailability.map((item) => (
            <OpeningTime
              key={item.availability}
              periods={item.periods}
              availability={item.availability}
            />
          ))}
        </Stack>
      ) : (
        <Typography>
          {t("contact.opening_hours_section.information")}
        </Typography>
      )}
    </InfoSection>
  );
}

const OpeningTimePair = styled("dd")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "80px auto",
  gap: theme.spacing(1),
  margin: 0,
  width: "100%",
}));

function OpeningTime({
  periods,
  availability,
}: Readonly<{
  periods: string[][];
  availability: string;
}>) {
  return (
    <Grid container columnGap={1}>
      <Typography component="dt" sx={{ display: "grid", size: 12 }}>
        {availability}
      </Typography>
      <OpeningTimePair>
        {periods
          .map((period) => period)
          .map((item) => {
            const days = item[0];
            const hours = item[1];

            return (
              <>
                <Typography component="span">{days}</Typography>
                <Typography component="span">{hours}</Typography>
              </>
            );
          })}
      </OpeningTimePair>
    </Grid>
  );
}
