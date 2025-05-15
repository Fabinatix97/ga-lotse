/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ApiUserRole } from "@eshg/base-api";
import { SearchParams } from "@eshg/lib-portal/types/pageParams";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useGetUsersByGroupQuery } from "../../../api/queries/users";
import { OverlayBoundary } from "../../../components/boundaries/OverlayBoundary";
import { ButtonBar } from "../../../components/buttons/ButtonBar";
import { InformationSheet } from "../../../components/content/InformationSheet";
import { PageGrid } from "../../../components/page/PageGrid";
import { Timeline } from "../../../components/timeline/Timeline";
import { TimelineEntry } from "../../../components/timeline/TimelineEntry";
import { useIsOffline } from "../../../hooks/useIsOffline";
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
import { CreateProgressEntrySidebar } from "./sidebars/CreateProgressEntrySidebar";
import { FilesSidebar } from "./sidebars/FilesSidebar";
import { ApprovalRequestsOverviewSidebar } from "./sidebars/approvalRequestOverviewSidebar/ApprovalRequestsOverviewSidebar";
import { ProgressEntryDetailsSidebar } from "./sidebars/progressEntryDetailsSidebar/ProgressEntryDetailsSidebar";

export interface ProgressEntriesPageProps extends ProgressEntryClients {
  businessModule: ApiBusinessModule;
  procedureId: string;
  searchParams: SearchParams;
  leaderRole: ApiUserRole;
  systemProgressEntryTypes: Record<string, string>;
  groupName: string;
  additionalKeyDocumentTypes?: Record<string, string>;
}

export function ProgressEntriesPage({
  businessModule,
  progressEntryApi,
  procedureApi,
  procedureId,
  searchParams,
  additionalKeyDocumentTypes,
  systemProgressEntryTypes,
  ...props
}: ProgressEntriesPageProps) {
  const [filters, setFilters] = useState<ProgressEntriesFilters>({});

  const {
    progressEntries,
    detailedProcedure,
    files,
    approvalRequestsResponse,
  } = useFetchProgressEntries(
    progressEntryApi,
    procedureApi,
    businessModule,
    procedureId,
    props.leaderRole,
    filters,
    props.getHeadersForOfflineCaching,
  ).data;
  const { data: users } = useSuspenseQuery(
    useGetUsersByGroupQuery(
      props.groupName,
      props.getHeadersForOfflineCaching?.(),
    ),
  );

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
      <ProgressEntriesPageComponent />
    </ProgressEntriesProvider>
  );
}

function ProgressEntriesPageComponent() {
  const progressEntriesContext = useProgressEntriesContext();
  const { filterSettings } = progressEntriesContext.config;
  const { entryIdForDetails } = progressEntriesContext.state;
  const [showCreateProgressEntrySidebar, setShowCreateProgressEntrySidebar] =
    useState(false);
  const [showFilesSidebar, setShowFilesSidebar] = useState(false);
  const [showApprovalRequestsSidebar, setShowApprovalRequestsSidebar] =
    useState(false);

  function openCreateProgressEntrySidebar() {
    setShowCreateProgressEntrySidebar(true);
  }

  function closeCreateProgressEntrySidebar() {
    setShowCreateProgressEntrySidebar(false);
  }

  function openFilesSidebar() {
    setShowFilesSidebar(true);
  }

  function closeFilesSidebar() {
    setShowFilesSidebar(false);
  }

  function openApprovalRequestsSidebar() {
    setShowApprovalRequestsSidebar(true);
  }

  function closeApprovalRequestsSidebar() {
    setShowApprovalRequestsSidebar(false);
  }

  const isReadOnly = useIsReadOnly();
  const isOffline = useIsOffline();
  const deletionProps = useDeletionProps();
  const FileDeletionModal = deletionProps.FileModal;
  const hasDeletionRights = useHasDeletionRights();

  return (
    <>
      <Stack gap={3} data-testid="progressEntriesPage">
        <ButtonBar
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
                onClick={openCreateProgressEntrySidebar}
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
                  <ProgressEntriesInformationSheet
                    openApprovalRequestsSidebar={openApprovalRequestsSidebar}
                  />
                </Grid>,
                <Grid key="filesSheet" xxs={12} lg={3}>
                  <FilesSheet openFilesSidebar={openFilesSidebar} />
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
                  <ProgressEntriesInformationSheet
                    openApprovalRequestsSidebar={openApprovalRequestsSidebar}
                  />
                </Grid>,
                <Grid key="filesSheet" xxs={12} md={6} lg={4} xl={3}>
                  <FilesSheet openFilesSidebar={openFilesSidebar} />
                </Grid>,
              ]}
        </PageGrid>
      </Stack>
      <CreateProgressEntrySidebar
        open={showCreateProgressEntrySidebar}
        onClose={closeCreateProgressEntrySidebar}
      />
      <FilesSidebar open={showFilesSidebar} onClose={closeFilesSidebar} />
      {hasDeletionRights && (
        <ApprovalRequestsOverviewSidebar
          open={showApprovalRequestsSidebar}
          onClose={closeApprovalRequestsSidebar}
        />
      )}
      {entryIdForDetails !== null ? (
        <OverlayBoundary>
          <ProgressEntryDetailsSidebar progressEntryId={entryIdForDetails} />
        </OverlayBoundary>
      ) : null}
      <FileDeletionModal />
    </>
  );
}

interface ProgressEntriesInformationSheetProps {
  openApprovalRequestsSidebar: () => void;
}

function ProgressEntriesInformationSheet({
  openApprovalRequestsSidebar,
}: ProgressEntriesInformationSheetProps) {
  const { searchParams, approvalRequestsResponse } = useProgressEntriesConfig();
  const timelineEntryProps = useTimelineEntryProps();

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
    <InformationSheet>
      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Typography level="h3" component="h2">
          Verlaufseinträge
        </Typography>
        <Stack direction="row" spacing={2}>
          {showApprovalRequests && (
            <Button
              startDecorator={<DeleteOutlined />}
              variant="outlined"
              color="danger"
              size="sm"
              onClick={openApprovalRequestsSidebar}
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
    </InformationSheet>
  );
}

interface FilesSheetProps {
  openFilesSidebar: () => void;
}

function FilesSheet({ openFilesSidebar }: FilesSheetProps) {
  const { files } = useProgressEntriesConfig();

  return (
    <Sheet data-testid="files">
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
        <Typography level="title-md" marginTop={0.5}>
          {`Dateien (${files.length})`}
        </Typography>
        <Button variant="plain" size="sm" onClick={openFilesSidebar}>
          Alle anzeigen
        </Button>
      </Stack>
      <Stack spacing={1}>
        {files.slice(0, 5).map(({ file, progressEntryId }) => (
          <FileCardWithActions
            key={`file-overview-${file.fileId}`}
            detailsProgressEntryId={progressEntryId}
            file={file}
          />
        ))}
      </Stack>
    </Sheet>
  );
}
