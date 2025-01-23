/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiVersion } from "@eshg/citizen-portal-api/openData";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { parseOptionalNonNegativeInt } from "@eshg/lib-portal/helpers/searchParams";
import { ChevronRightOutlined } from "@mui/icons-material";
import { Card, CardContent, List, ListItem, Stack, Typography } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { isEmpty } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { useGetOpenDocuments } from "@/lib/businessModules/opendata/api/queries/citizenPublicApi";
import { OpenDataFilters } from "@/lib/businessModules/opendata/components/OpenDataFilters";
import { SEARCH_PARAMS } from "@/lib/businessModules/opendata/components/helpers";
import { useOpenDataFilterValues } from "@/lib/businessModules/opendata/components/useOpenDataFilterValues";
import { fileTypeNames } from "@/lib/businessModules/opendata/shared/constants";
import { useCitizenRoutes } from "@/lib/businessModules/opendata/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { MobileBreakpoint, byBreakpoint } from "@/lib/shared/breakpoints";
import { Pagination } from "@/lib/shared/components/Pagination";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

const PAGE_SIZE = 10;

export function OpenDataOverviewContent() {
  const { t } = useTranslation(["opendata/overview"]);
  const isMobile = useIsMobile();

  const { pageNumber, setPageNumber } = usePagination();

  const filterValues = useOpenDataFilterValues();
  const {
    data: { totalElements, elements },
  } = useGetOpenDocuments({
    pageNumber,
    pageSize: PAGE_SIZE,
    searchString: filterValues.search,
    sourcesFilter: filterValues.topic,
    fileTypeFilter: filterValues.fileType,
    statisticsYearFilter: filterValues.year,
  });
  const versions = elements.flatMap(({ versions }) => versions);

  return (
    <PageContent>
      <PageTitle>{t("pageTitle")}</PageTitle>
      <GridColumnStack>
        <ContentSheet>
          <ContentSheetTitle>{t("aboutSection.title")}</ContentSheetTitle>
          <Typography>{t("aboutSection.text")}</Typography>
        </ContentSheet>

        {isMobile && <OpenDataFilters isMobile={true} />}

        <ContentSheet>
          {!isMobile && (
            <Stack gap={2}>
              <OpenDataFilters isMobile={false} />
            </Stack>
          )}
          <Typography level="h3" sx={{ marginTop: 1 }}>
            {totalElements === 1
              ? t("resultSection.foundSingular", { totalElements })
              : t("resultSection.foundPlural", { totalElements })}
          </Typography>

          <List
            sx={{ padding: 0, gap: "inherit" }}
            aria-label={t("resultSection.results")}
          >
            {versions.map((version) => (
              <ListItem key={version.externalId} sx={{ padding: 0 }}>
                <OpenDataCard version={version} />
              </ListItem>
            ))}
          </List>

          {/* TODO: ISSUE-7233: replace pagination with "Show more" button  */}
          {totalElements > PAGE_SIZE && (
            <Pagination
              totalCount={totalElements}
              pageSize={PAGE_SIZE}
              pageNumber={pageNumber}
              onPageChange={setPageNumber}
            />
          )}
        </ContentSheet>
      </GridColumnStack>
    </PageContent>
  );
}

function OpenDataCard({ version }: { version: ApiVersion }) {
  const { t } = useTranslation(["opendata/overview"]);
  const citizenRoutes = useCitizenRoutes();

  return (
    <Card
      key={version.externalId}
      variant="plain"
      sx={{
        flexGrow: 1,
        backgroundColor: "background.level1",
        marginX: byBreakpoint({ mobile: -2, desktop: 0 }),
        [theme.breakpoints.down(MobileBreakpoint.Down)]: {
          borderRadius: 0,
        },
      }}
    >
      <InternalLink
        href={citizenRoutes.byId(version.externalId)}
        underline="none"
        overlay
      >
        <CardContent orientation="horizontal" sx={{ gap: 3 }}>
          <Stack gap={2} flexGrow="1">
            <Stack
              gap={2}
              direction={byBreakpoint({ mobile: "column", desktop: "row" })}
              justifyContent={"space-between"}
            >
              <Typography level="h3" component="h3">
                {version.versionName}
              </Typography>
              <Typography
                level="title-md"
                whiteSpace="nowrap"
                mr={byBreakpoint({ mobile: 0, desktop: 8 })}
              >
                {t("resultSection.version")} {version.major}.{version.minor}
              </Typography>
            </Stack>
            <Typography level="title-md">
              {fileTypeNames[version.fileType]}
            </Typography>
            {!isEmpty(version.description) && (
              <Typography level="body-md">{version.description}</Typography>
            )}
          </Stack>
          <ChevronRightOutlined size="md" />
        </CardContent>
      </InternalLink>
    </Card>
  );
}

function usePagination() {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();
  const pageNumber =
    parseOptionalNonNegativeInt(searchParams.get(SEARCH_PARAMS.pageNumber)) ??
    0;

  function setPageNumber(newPageNumber: number) {
    replaceSearchParams([
      { name: SEARCH_PARAMS.pageNumber, value: newPageNumber },
    ]);
  }

  return { pageNumber, setPageNumber };
}
