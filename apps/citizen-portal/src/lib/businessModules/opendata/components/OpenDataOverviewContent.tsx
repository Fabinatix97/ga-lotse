/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChevronRightOutlined, RefreshOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/joy";
import { startTransition } from "react";
import { Trans } from "react-i18next";
import { isDefined, isEmpty } from "remeda";

import { InternalLink, useIsMobile } from "@eshg/lib-portal";
import { ApiVersion } from "@eshg/opendata-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { useGetOpenDocuments } from "@/lib/businessModules/opendata/api/queries/citizenPublicApi";
import { OpenDataFilters } from "@/lib/businessModules/opendata/components/OpenDataFilters";
import { useOpenDataFilterValues } from "@/lib/businessModules/opendata/components/useOpenDataFilterValues";
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

const PAGE_SIZE = 10;

export function OpenDataOverviewContent() {
  const { t } = useTranslation(["opendata/overview"]);
  const isMobile = useIsMobile();

  const filterValues = useOpenDataFilterValues();
  const { data, fetchNextPage, hasNextPage, isFetching } = useGetOpenDocuments({
    pageSize: PAGE_SIZE,
    searchString: filterValues.search,
    sourcesFilter: filterValues.topic,
    fileTypeFilter: filterValues.fileType,
    statisticsYearFilter: filterValues.year,
  });

  return (
    <PageContent>
      <PageTitle>{t("pageTitle")}</PageTitle>
      <GridColumnStack>
        <ContentSheet>
          <ContentSheetTitle>{t("aboutSection.title")}</ContentSheetTitle>
          <Typography>{t("aboutSection.text")}</Typography>
        </ContentSheet>

        {isMobile && <OpenDataFilters isMobile />}

        <ContentSheet>
          {!isMobile && (
            <Stack gap={2}>
              <OpenDataFilters isMobile={false} />
            </Stack>
          )}
          <Typography level="h3" sx={{ marginTop: 1 }}>
            {t("resultSection.found", {
              count: data?.totalElements ?? 0,
            })}
          </Typography>

          {isDefined(data) && (
            <>
              <List
                sx={{ padding: 0, gap: "inherit" }}
                aria-label={t("resultSection.results")}
              >
                {data.versions.map((version) => (
                  <ListItem key={version.externalId} sx={{ padding: 0 }}>
                    <OpenDataCard version={version} />
                  </ListItem>
                ))}
              </List>

              <Stack gap={2} alignItems="center">
                {hasNextPage && (
                  <Button
                    loading={isFetching}
                    variant="soft"
                    endDecorator={<RefreshOutlined />}
                    sx={{ margin: "auto" }}
                    onClick={() => {
                      startTransition(async () => {
                        await fetchNextPage();
                      });
                    }}
                  >
                    {t("pagination.loadMore")}
                  </Button>
                )}
                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                  }}
                >
                  <Trans
                    i18nKey="opendata/overview:pagination.shown"
                    count={data.totalElements}
                    values={{
                      shownElements: data.versions.length,
                    }}
                  />
                </Typography>
              </Stack>
            </>
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
              justifyContent="space-between"
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
