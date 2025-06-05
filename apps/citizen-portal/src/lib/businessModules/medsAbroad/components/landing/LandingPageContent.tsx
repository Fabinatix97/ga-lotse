/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Download } from "@mui/icons-material";
import {
  Chip,
  ChipProps,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { TFunction } from "i18next";
import { Trans } from "react-i18next";

import { ApiCountryCode, ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { Alert, ExternalLink, FileType } from "@eshg/lib-portal";
import { ApiGetOpeningHoursResponse } from "@eshg/sti-protection-api";

import { useTranslation } from "@/lib/i18n/client";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { EmailSection } from "@/lib/shared/components/EmailSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
import { PhoneSection } from "@/lib/shared/components/PhoneSection";
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

const departmentDetails: ApiGetDepartmentInfoResponse = {
  abbreviation: "",
  city: "Wandern Stadt",
  country: ApiCountryCode.De,
  email: "reisenmitbetaeubungsmitteln@eshg.de",
  homepage: "https://reisen-mit-betaeubungsmitteln.eshg.de",
  houseNumber: "202",
  location: {
    latitude: 50.114296,
    longitude: 8.691828,
  },
  name: "Reisen mit Betäubungsmitteln",
  phoneNumber: "+49 123 12345678",
  postalCode: "12345",
  street: "Wanderluststraße",
};

const openingHours: ApiGetOpeningHoursResponse = {
  de: ["Mo - Do", "8:00 - 12:00\n3:00 - 16:30", "Fr", "10:00 - 14:00"],
  en: ["Mon - Thu", "8:00 - 12:00\n3:00 - 16:30", "Fri", "10:00 - 14:00"],
};

const CONTACT_LOCALE_PATH = "medsAbroad/contact";

function ContactDetails() {
  const { t } = useTranslation([CONTACT_LOCALE_PATH]);

  return (
    <ContentSheet>
      <ContentSheetTitle>
        {t("contact.contact_section.title")}
      </ContentSheetTitle>
      <InfoSectionGrid>
        <AddressSection
          department={departmentDetails}
          localePath={CONTACT_LOCALE_PATH}
        />
        <OpeningHoursSection
          openingHours={openingHours}
          localePath={CONTACT_LOCALE_PATH}
          subtitle={t("contact.opening_hours_section.subtitle")}
        />
        <PhoneSection
          department={departmentDetails}
          localePath={CONTACT_LOCALE_PATH}
        />
        <EmailSection
          department={departmentDetails}
          localePath={CONTACT_LOCALE_PATH}
        />
      </InfoSectionGrid>
    </ContentSheet>
  );
}

export function LandingPageContent() {
  const { t } = useTranslation(["medsAbroad/overview"]);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("generalInformation.title")}</ContentSheetTitle>
        <Typography>{t("generalInformation.description")}</Typography>
        <RegulationsSection />
        <DocumentsSection />
        <ProcessingTimeSection />
      </ContentSheet>
      <ContactDetails />
    </GridColumnStack>
  );
}

const genericListSx: SxProps = {
  "--List-gap:": "0.5px",
  "--ListItem-minHeight:": 0,
  "--ListItem-paddingY:": 0,
  "--ListDivider-gap:": 0,
  "--ListItem-paddingLeft:": 0,
};

const infoLinks = {
  bundesinstitutFuerArzneimittelUndMedizinProdukte: {
    bescheinigungSchengenStaatenPdf:
      "https://www.bfarm.de/SharedDocs/Downloads/DE/Bundesopiumstelle/Betaeubungsmittel/Reisen/reise_scheng_formular.pdf?__blob=publicationFile",
    bescheinigungAndereLaenderPdf:
      "https://www.bfarm.de/SharedDocs/Downloads/DE/Bundesopiumstelle/Betaeubungsmittel/Reisen/reise_andere_formular.pdf?__blob=publicationFile",
  },
};

function FileTypeChip({
  fileType = FileType.Pdf.name,
  sx,
  ...chipProps
}: {
  fileType?: FileType["name"];
} & ChipProps) {
  return (
    <Chip
      size="sm"
      variant="soft"
      sx={{ verticalAlign: "super", ...sx }}
      {...chipProps}
    >
      {fileType}
    </Chip>
  );
}

function DocumentsSection() {
  const { t } = useTranslation(["medsAbroad/overview"]);

  return (
    <>
      <InfoSection>
        <InfoSectionTitle>{t("documentsSection.title")}</InfoSectionTitle>
        <Typography>{t("documentsSection.description")}</Typography>{" "}
        <List marker="disc" component="ul" sx={genericListSx}>
          <ListItem>
            <Trans
              t={t as unknown as TFunction}
              i18nKey="medsAbroad/overview:documentsSection.checklist.certificateFromDoctor"
            />
          </ListItem>
          <ListItem>
            <Trans
              t={t as unknown as TFunction}
              i18nKey="medsAbroad/overview:documentsSection.checklist.personalIdentityDocument"
            />
          </ListItem>
        </List>
      </InfoSection>
      <Alert
        title={t("documentsSection.notice.title")}
        color="primary"
        message={t("documentsSection.notice.description")}
      />
    </>
  );
}

function RegulationsSection() {
  const { t } = useTranslation(["medsAbroad/overview"]);

  return (
    <>
      <Typography>{t("regulationsSection.title")}</Typography>
      <List marker="disc" component="ul" sx={genericListSx}>
        <ListItem>
          <ListItemContent>
            <Typography fontWeight={600}>
              {t("regulationsSection.schengenStates.title")}
            </Typography>
            <Typography ml={1}>
              {t("regulationsSection.schengenStates.description")}
            </Typography>
            <ExternalLink
              href={
                infoLinks.bundesinstitutFuerArzneimittelUndMedizinProdukte
                  .bescheinigungSchengenStaatenPdf
              }
              openInNewTab
              sx={{ mt: 2 }}
              startDecorator={<Download />}
            >
              <Typography>
                {t(
                  "regulationsSection.schengenStates.relevantDocuments.certificateForm.downloadLabel",
                )}
                <FileTypeChip sx={{ ml: 1 }} />
              </Typography>
            </ExternalLink>
          </ListItemContent>
        </ListItem>
        <ListItem sx={{ mt: 2 }}>
          <ListItemContent>
            <Typography fontWeight={600}>
              {t("regulationsSection.otherCountries.title")}
            </Typography>
            <Typography ml={1}>
              {t("regulationsSection.otherCountries.description")}
            </Typography>
            <ExternalLink
              href={
                infoLinks.bundesinstitutFuerArzneimittelUndMedizinProdukte
                  .bescheinigungAndereLaenderPdf
              }
              openInNewTab
              sx={{ mt: 2 }}
              startDecorator={<Download />}
            >
              <Typography>
                {t(
                  "regulationsSection.otherCountries.relevantDocuments.certificateForm.downloadLabel",
                )}
                <FileTypeChip sx={{ ml: 1 }} />
              </Typography>
            </ExternalLink>
          </ListItemContent>
        </ListItem>
      </List>
    </>
  );
}

function ProcessingTimeSection() {
  const { t } = useTranslation(["medsAbroad/overview"]);

  return (
    <InfoSection>
      <InfoSectionTitle>{t("processingTimeSection.title")}</InfoSectionTitle>
      <Typography>{t("processingTimeSection.description")}</Typography>
    </InfoSection>
  );
}

export function AppointmentSection() {
  const { t } = useTranslation(["medsAbroad/overview"]);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("appointmentsSection.title")}</ContentSheetTitle>
      <Typography>{t("appointmentsSection.description")}</Typography>
    </ContentSheet>
  );
}

export function LandingPageSidePanel() {
  return (
    <GridColumnStack>
      <AppointmentSection />
    </GridColumnStack>
  );
}
