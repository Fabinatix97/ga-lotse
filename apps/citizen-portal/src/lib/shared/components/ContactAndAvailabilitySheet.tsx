/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AccessTimeOutlined,
  ArrowRightAltOutlined,
  ChatBubbleOutlineOutlined,
  FmdGoodOutlined,
  LaptopMacOutlined,
} from "@mui/icons-material";
import { Box, Stack, Typography, styled } from "@mui/joy";
import { ReactElement, ReactNode } from "react";
import {
  isDefined,
  isPlainObject,
  map,
  partition,
  pipe,
  splitAt,
  zip,
} from "remeda";

import {
  ExternalLink,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useLang } from "@/lib/i18n/useLang";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function ContactAndAvailabilitySheet(props: {
  openingHoursSectionProps: Omit<OpeningHoursSectionProps, "title">;
  departmentInfo: {
    email: string;
    phoneNumber: string;
    name: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    homepage: string;
  };
  internetLabel?: string;
}) {
  const { t } = useTranslation(["shared/contactAndAvailability"]);
  return (
    <ContentSheet>
      <Box display="contents" component="dl">
        <ContentSheetTitle>{t("title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <Section
            title={t("address")}
            icon={<FmdGoodOutlined />}
            items={[
              props.departmentInfo.name,
              formatStreetAndHouseNumber(props.departmentInfo),
              formatPostalCodeAndCity(props.departmentInfo),
            ]}
          />
          <OpeningHoursSection
            title={t("openingAndConsultationHours")}
            {...props.openingHoursSectionProps}
          />
          <Section
            title={t("contact")}
            icon={<ChatBubbleOutlineOutlined />}
            items={[
              t("phone", {
                phoneNumber: props.departmentInfo.phoneNumber,
              }),
              <Typography key="email">
                {t("email")}
                {`\u00A0`}
                <ExternalLink href={`mailto:${props.departmentInfo.email}`}>
                  {props.departmentInfo.email}
                </ExternalLink>
              </Typography>,
            ]}
          />
          {props.internetLabel && (
            <Section
              title={t("internet")}
              icon={<LaptopMacOutlined />}
              items={[
                <ExternalLink
                  key="internet"
                  sx={{
                    justifyContent: "space-between",
                    wordBreak: "break-all",
                  }}
                  href={`https://${props.departmentInfo.homepage}`}
                  endDecorator={<ArrowRightAltOutlined />}
                >
                  {props.internetLabel}
                </ExternalLink>,
              ]}
            />
          )}
        </InfoSectionGrid>
      </Box>
    </ContentSheet>
  );
}

function Section(props: {
  title: string;
  icon: ReactElement;
  items: (string | ReactNode)[];
}) {
  return (
    <InfoSection icon={props.icon}>
      <InfoSectionTitle component="dt">{props.title}</InfoSectionTitle>
      <Stack>
        {props.items.map((item, index) => (
          <Box key={index} display="contents" component="dd">
            {typeof item === "string" && <Typography>{item}</Typography>}
            {typeof item === "object" && item}
          </Box>
        ))}
      </Stack>
    </InfoSection>
  );
}

interface OpeningHoursSectionProps {
  title: string;
  information?: string;
  openingHourTranslations?: Record<SupportedLanguage, string[]>;
  subtitle?: string;
}

export function OpeningHoursSection(props: Readonly<OpeningHoursSectionProps>) {
  const lang = useLang();
  const translatedOpeningHours = props.openingHourTranslations
    ? props.openingHourTranslations[lang]
    : [];

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

  const openingTimes = [
    ...pairedAvailability.map(([period, availabilities]) => (
      <OpeningTime
        key={period}
        period={period}
        availabilities={availabilities}
      />
    )),
    additionalInformation && (
      <Typography whiteSpace="pre-line">{additionalInformation}</Typography>
    ),
  ];

  return (
    <Section
      title={props.title}
      icon={<AccessTimeOutlined />}
      items={[
        props.subtitle && (
          <Typography level="body-md">{props.subtitle}</Typography>
        ),
        ...openingTimes,
        !isDefined(props.openingHourTranslations) &&
          isDefined(props.information) && (
            <Typography>{props.information}</Typography>
          ),
      ].filter(isPlainObject)}
    />
  );
}

const OpeningTimePair = styled("div")(({ theme }) => ({
  display: "grid",
  gridAutoColumns: "minmax(0, 1fr)",
  gridAutoFlow: "column",
  gap: theme.spacing(2),
  margin: 0,
  "&:not(:first-child)": {
    marginTop: "0.5rem",
  },
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
      <Typography sx={{ mr: 1, hyphens: "auto" }}>{period}</Typography>
      <Stack>
        {availabilities.map((text) => (
          <Typography key={text} sx={{ m: 0, hyphens: "auto" }}>
            {text}
          </Typography>
        ))}
      </Stack>
    </OpeningTimePair>
  );
}
