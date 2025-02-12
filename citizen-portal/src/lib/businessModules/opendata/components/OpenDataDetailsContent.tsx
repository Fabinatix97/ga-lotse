/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatFileSize } from "@eshg/lib-portal/helpers/file";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { ApiVersion } from "@eshg/opendata-api";
import { DownloadOutlined, FileCopyOutlined } from "@mui/icons-material";
import { Button, Card, Chip, Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { useId } from "react";
import { isEmpty, isNonNullish } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { useOpenDataPublicCitizenApi } from "@/lib/businessModules/opendata/api/clients";
import { useGetVersion } from "@/lib/businessModules/opendata/api/queries/citizenPublicApi";
import { fileTypeNames } from "@/lib/businessModules/opendata/shared/constants";
import { useCitizenRoutes } from "@/lib/businessModules/opendata/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { MobileBreakpoint, byBreakpoint } from "@/lib/shared/breakpoints";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

interface OpenDataDetailsContentProps {
  versionId: string;
}

export function OpenDataDetailsContent(props: OpenDataDetailsContentProps) {
  const { t } = useTranslation(["opendata/details"]);
  const { data } = useGetVersion(props.versionId);

  const resourceTitleId = useId();
  const informationTitleId = useId();

  return (
    <PageContent>
      <PageTitle>{t("pageTitle")}</PageTitle>

      <GridColumnStack>
        <ContentSheet>
          <ContentSheetTitle>{data.versionName}</ContentSheetTitle>
          {!isEmpty(data.description) && (
            <Typography>{data.description}</Typography>
          )}
        </ContentSheet>
        <ContentSheet>
          <ContentSheetTitle sx={visuallyHidden}>
            {t("detailsSectionTitle")}
          </ContentSheetTitle>
          <Stack
            component="section"
            aria-labelledby={resourceTitleId}
            gap="inherit"
          >
            <Typography level="h3" id={resourceTitleId}>
              {t("resource.title")}
            </Typography>
            <OpenDataFileCard version={data} />
          </Stack>

          <Stack
            component="section"
            aria-labelledby={informationTitleId}
            gap="inherit"
          >
            <Typography level="h3" id={informationTitleId}>
              {t("information.title")}
            </Typography>
            <OpenDataVersionInfo version={data} />
          </Stack>
        </ContentSheet>
      </GridColumnStack>
    </PageContent>
  );
}

function OpenDataFileCard({ version }: { version: ApiVersion }) {
  const { t } = useTranslation(["opendata/details"]);
  const openDataApi = useOpenDataPublicCitizenApi();
  const { download } = useFileDownload(() =>
    openDataApi.downloadDocument1Raw({ versionId: version.externalId }),
  );

  return (
    <Card
      data-testid="openDataFileCard"
      variant="plain"
      sx={{
        backgroundColor: "background.level1",
        marginX: byBreakpoint({ mobile: -2, desktop: 0 }),
        justifyContent: "space-between",
        alignItems: byBreakpoint({
          mobile: "stretch",
          desktop: "center",
        }),
        flexDirection: byBreakpoint({
          mobile: "column",
          desktop: "row",
        }),
        [theme.breakpoints.down(MobileBreakpoint.Down)]: {
          borderRadius: 0,
        },
      }}
    >
      <Stack direction="row" gap={2}>
        <FileCopyOutlined />
        <Stack>
          <Typography level="title-md">{version.fileName}</Typography>
          <Stack direction="row" flexWrap="wrap" columnGap={2}>
            <Typography whiteSpace="nowrap">
              {t("resource.fileSize")}: {formatFileSize(version.fileSize)}
            </Typography>
            <Typography whiteSpace="nowrap">
              {t("resource.fileFormat")}: {fileTypeNames[version.fileType]}
            </Typography>
            <Typography whiteSpace="nowrap">
              {t("resource.publicationDate")}:{" "}
              {formatDate(version.publicationDate)}
            </Typography>
            <Typography whiteSpace="nowrap">
              {t("resource.version")}: {version.major}.{version.minor}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Button
        startDecorator={<DownloadOutlined />}
        variant="outlined"
        size="lg"
        sx={{ background: "white", paddingX: 8 }}
        onClick={() => download()}
      >
        {t("resource.download", {
          fileType: fileTypeNames[version.fileType],
        })}
      </Button>
    </Card>
  );
}

type KnownSources =
  | "INSPECTION"
  | "SCHOOL_ENTRY"
  | "TRAVEL_MEDICINE"
  | "MEASLES_PROTECTION"
  | "STI_PROTECTION"
  | "MEDICAL_REGISTRY"
  | "DENTAL"
  | "OFFICIAL_MEDICAL_SERVICE";

function OpenDataVersionInfo({ version }: { version: ApiVersion }) {
  const { t } = useTranslation(["opendata/details", "opendata/shared"]);
  const citizenRoutes = useCitizenRoutes();

  // Ensures translations exist for all sources
  const sources = Array.from(version.sources) satisfies KnownSources[];

  return (
    <Stack
      sx={{
        marginX: byBreakpoint({ mobile: -2, desktop: 0 }),
        "& > :nth-child(2n + 1)": {
          backgroundColor: (theme) => theme.palette.background.level1,
        },
      }}
    >
      <LabeledValue label={t("information.source")}>
        {sources.length !== 0 ? (
          <Stack component="span" direction="row" flexWrap="wrap">
            {sources.map((source) => (
              <Chip
                key={source}
                component="span"
                color="primary"
                sx={{ marginBottom: 0.75 }}
              >
                {t(`sources.${source}`, { ns: "opendata/shared" })}{" "}
              </Chip>
            ))}
          </Stack>
        ) : (
          "-"
        )}
      </LabeledValue>
      <LabeledValue label={t("information.startDate")}>
        {isNonNullish(version.statisticStartDate)
          ? formatDate(version.statisticStartDate)
          : "-"}
      </LabeledValue>
      <LabeledValue label={t("information.endDate")}>
        {isNonNullish(version.statisticEndDate)
          ? formatDate(version.statisticEndDate)
          : "-"}
      </LabeledValue>
      <LabeledValue label={t("information.fileName")}>
        {version.fileName}
      </LabeledValue>
      <LabeledValue label={t("information.fileType")}>
        {fileTypeNames[version.fileType]}
      </LabeledValue>
      <LabeledValue label={t("information.licence")}>
        <ExternalLink href={version.licence} target="_blank" rel="noreferrer">
          {version.licence}
        </ExternalLink>
      </LabeledValue>
      <LabeledValue label={t("information.termsOfUse")}>
        <InternalLink href={citizenRoutes.termsOfUse}>
          {t("information.termsOfUseLink")}
        </InternalLink>
      </LabeledValue>
    </Stack>
  );
}

function LabeledValue({
  label,
  children,
}: RequiresChildren & {
  label: string;
}) {
  return (
    <Stack
      direction={byBreakpoint({ mobile: "column", desktop: "row" })}
      alignItems={byBreakpoint({ mobile: "flex-start", desktop: "center" })}
      gap={byBreakpoint({ mobile: 1, desktop: 2 })}
      paddingX={byBreakpoint({ mobile: 2, desktop: 1 })}
      paddingY={1}
    >
      <Typography level="title-md" flex="1 0 0px">
        {label}
      </Typography>
      <Typography
        flex="1 0 0px"
        sx={{ wordBreak: "break-word", maxWidth: "100%" }}
      >
        {children}
      </Typography>
    </Stack>
  );
}
