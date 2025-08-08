/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { ApiUserRole } from "@eshg/base-api";
import { LiveAnnouncer, SearchParams } from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { ButtonBar } from "../../../components/buttons/ButtonBar";
import { InformationSheet } from "../../../components/content/InformationSheet";
import { PageGrid } from "../../../components/page/PageGrid";
import { Timeline } from "../../../components/timeline/Timeline";
import { TimelineEntry } from "../../../components/timeline/TimelineEntry";
import { useIsOffline } from "../../../hooks/useIsOffline";
import { SidebarScope } from "../../drawer/contexts/sidebarScope";
import { FilterSettings } from "../../filters/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "../../filters/components/filterSettings/FilterSettingsSheet";
import { ToggleFilterButton } from "../../filters/components/filterSettings/ToggleFilterButton";
import { useFetchProgressEntries } from "../api/queries/progressEntry";
import { keyDocumentTypes } from "../config/documentTypes";
import { generalSystemProgressEntryTypeTitles } from "../config/progressEntryTypes";
import {
  ProgressEntriesProvider,
  useHasDeletionRights,
  useIsReadOnly,
  useProgressEntriesConfig,
  useProgressEntriesContext,
} from "../contexts/progressEntries";
import { useDeletionProps } from "../hooks/useDeletionProps";
import { useProgressEntriesFilterSettings } from "../hooks/useProgressEntriesFilterSettings";
import { ProgressEntryClients } from "../types/api";
import { ProgressEntriesFilters } from "../types/common";
import { useTimelineEntryProps } from "../utils/buildTimelineEntryProps";

import { FileCardWithActions } from "./FileCardWithActions";
import { SortSelect } from "./SortSelect";
import { useCreateProgressEntrySidebar } from "./sidebars/CreateProgressEntrySidebar";
import { useFilesSidebar } from "./sidebars/FilesSidebar";
import { useApprovalRequestsOverviewSidebar } from "./sidebars/approvalRequestOverviewSidebar/ApprovalRequestsOverviewSidebar";

export interface ProgressEntriesPageProps extends ProgressEntryClients {
  businessModule: ApiBusinessModule;
  procedureId: string;
  searchParams: SearchParams;
  leaderRole: ApiUserRole;
  systemProgressEntryTypes: Record<string, string>;
  groupName: string;
  additionalKeyDocumentTypes?: Record<string, string>;
  ariaRole?: string;
}

export function ProgressEntriesPage({
  businessModule,
  progressEntryApi,
  procedureApi,
  procedureId,
  searchParams,
  additionalKeyDocumentTypes,
  systemProgressEntryTypes,
  ariaRole,
  ...props
}: ProgressEntriesPageProps) {
  const [filters, setFilters] = useState<ProgressEntriesFilters>({});

  const {
    progressEntries,
    detailedProcedure,
    files,
    approvalRequestsResponse,
    users,
  } = useFetchProgressEntries(
    progressEntryApi,
    procedureApi,
    businessModule,
    procedureId,
    props.leaderRole,
    filters,
    props.groupName,
    props.getHeadersForOfflineCaching,
  ).data;

  const filterSettings = useProgressEntriesFilterSettings({
    users,
    systemProgressEntryTypes,
    onFilterApply: setFilters,
  });

  return (
    <ProgressEntriesProvider
      progressEntriesConfig={{
        progressEntries,
        detailedProcedure,
        procedureId,
        files,
        keyDocumentTypes: {
          ...keyDocumentTypes,
          ...additionalKeyDocumentTypes,
        },
        progressEntryTypes: {
          ...generalSystemProgressEntryTypeTitles,
          ...systemProgressEntryTypes,
        },
        approvalRequestsResponse: approvalRequestsResponse,
        searchParams,
        filterSettings,
        businessModule,
        progressEntryApi,
        procedureApi,
        ...props,
      }}
    >
      <SidebarScope>
        <ProgressEntriesPageComponent ariaRole={ariaRole} />
      </SidebarScope>
    </ProgressEntriesProvider>
  );
}

function ProgressEntriesPageComponent(props: { ariaRole?: string }) {
  const progressEntriesContext = useProgressEntriesContext();
  const { filterSettings } = progressEntriesContext.config;
  const createProgressEntrySidebar = useCreateProgressEntrySidebar();

  const isReadOnly = useIsReadOnly();
  const isOffline = useIsOffline();
  const deletionProps = useDeletionProps();
  const FileDeletionModal = deletionProps.FileModal;

  return (
    <>
      <Stack gap={3} data-testid="progressEntriesPage" role={props.ariaRole}>
        <ButtonBar
          invertDomOrder
          left={
            !isOffline && (
              <ToggleFilterButton {...filterSettings.filterButtonProps} />
            )
          }
          right={
            !isReadOnly &&
            !isOffline && (
              <Button
                startDecorator={<Add />}
                onClick={createProgressEntrySidebar.open}
              >
                Neuen Verlaufseintrag erstellen
              </Button>
            )
          }
        />
        <PageGrid>
          {filterSettings.filterSettingsVisible
            ? [
                <Grid key="filterSheet" xxs={12} lg={3}>
                  <FilterSettingsSheet
                    {...filterSettings.filterSettingsSheetProps}
                  >
                    <FilterSettings {...filterSettings.filterSettingsProps} />
                  </FilterSettingsSheet>
                </Grid>,
                <Grid key="progressEntriesInformationSheet" xxs={12} lg={6}>
                  <ProgressEntriesInformationSheet />
                </Grid>,
                <Grid key="filesSheet" xxs={12} lg={3}>
                  <FilesSheet />
                </Grid>,
              ]
            : [
                <Grid
                  key="progressEntriesInformationSheet"
                  xxs={12}
                  md={6}
                  lg={8}
                  xl={9}
                >
                  <ProgressEntriesInformationSheet />
                </Grid>,
                <Grid key="filesSheet" xxs={12} md={6} lg={4} xl={3}>
                  <FilesSheet />
                </Grid>,
              ]}
        </PageGrid>
      </Stack>
      <FileDeletionModal />
    </>
  );
}

function ProgressEntriesInformationSheet() {
  const { searchParams, approvalRequestsResponse } = useProgressEntriesConfig();
  const timelineEntryProps = useTimelineEntryProps();
  const approvalRequestsOverviewSidebar = useApprovalRequestsOverviewSidebar();

  const approvalRequests = approvalRequestsResponse?.approvalRequests;
  const hasDeletionRights = useHasDeletionRights();
  const isReadOnly = useIsReadOnly();
  const isOffline = useIsOffline();
  const showApprovalRequests =
    hasDeletionRights &&
    !isReadOnly &&
    !isOffline &&
    !!approvalRequests?.length;

  return (
    <InformationSheet role="region" aria-labelledby="verlaufseintraege-label">
      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Typography level="h3" component="h1" id="verlaufseintraege-label">
          Verlaufseinträge
        </Typography>
        <Stack direction="row" spacing={2}>
          {showApprovalRequests && (
            <Button
              startDecorator={<DeleteOutlined />}
              variant="outlined"
              color="danger"
              size="sm"
              onClick={approvalRequestsOverviewSidebar.open}
            >
              {`Löschanfragen (${approvalRequests.length})`}
            </Button>
          )}
          {!isOffline && (
            <SortSelect aria-label="Sortierfolge" searchParams={searchParams} />
          )}
        </Stack>
      </Stack>
      <Divider />
      <Timeline>
        {timelineEntryProps.map((entryProps) => (
          <TimelineEntry
            {...entryProps}
            key={entryProps.key}
            data-testid="progressEntry"
          />
        ))}
      </Timeline>
      <LiveAnnouncer
        message="Keine Einträge vorhanden"
        active={timelineEntryProps.length === 0}
      />
      <LiveAnnouncer
        message={`${timelineEntryProps.length} Einträge vorhanden`}
        active={timelineEntryProps.length > 0}
      />
    </InformationSheet>
  );
}

function FilesSheet() {
  const { files } = useProgressEntriesConfig();
  const filesSidebar = useFilesSidebar();

  return (
    <Sheet data-testid="files" role="region" aria-labelledby="dateien-label">
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
        <Typography
          level="title-md"
          marginTop={0.5}
          component="h2"
          id="dateien-label"
        >
          {`Dateien (${files.length})`}
        </Typography>
        <Button variant="plain" size="sm" onClick={filesSidebar.open}>
          Alle anzeigen
        </Button>
      </Stack>
      <Stack spacing={1} role="list">
        {files.slice(0, 5).map(({ file, progressEntryId }) => (
          <FileCardWithActions
            key={`file-overview-${file.fileId}`}
            detailsProgressEntryId={progressEntryId}
            file={file}
            role="listitem"
          />
        ))}
      </Stack>
    </Sheet>
  );
}
