/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { DeleteOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useContext, useState } from "react";

import { useGetUsersByGroupQuery } from "@/lib/baseModule/api/queries/users";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";
import { keyDocumentTypes } from "@/lib/shared/components/procedures/progress-entries/constants";
import { useDeletionProps } from "@/lib/shared/components/procedures/progress-entries/hooks/useDeletionProps";
import { useProgressEntriesFilterSettings } from "@/lib/shared/components/procedures/progress-entries/hooks/useProgressEntriesFilterSettings";
import { useFetchProgressEntries } from "@/lib/shared/components/procedures/progress-entries/queries/progressEntryApi";
import { ApprovalRequestsOverviewSidebar } from "@/lib/shared/components/procedures/progress-entries/sidebars/approvalRequestOverviewSidebar/ApprovalRequestsOverviewSidebar";
import { Timeline } from "@/lib/shared/components/timeline/Timeline";
import { TimelineEntry } from "@/lib/shared/components/timeline/TimelineEntry";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

import { FileCardWithActions } from "./FileCardWithActions";
import {
  ProgressEntriesContext,
  ProgressEntriesProvider,
  useHasDeletionRights,
  useIsReadOnly,
  useProgressEntriesConfig,
} from "./ProgressEntriesContext";
import { SortSelect } from "./SortSelect";
import { useTimelineEntryProps } from "./buildTimelineEntryProps";
import { CreateProgressEntrySidebar } from "./sidebars/CreateProgressEntrySidebar";
import { FilesSidebar } from "./sidebars/FilesSidebar";
import { ProgressEntryDetailsSidebar } from "./sidebars/progressEntryDetailsSidebar/ProgressEntryDetailsSidebar";
import { ProgressEntriesFilters, ProgressEntriesPageProps } from "./types";

export function ProgressEntriesPage({
  progressEntryApiQueryKey,
  progressEntryApi,
  procedureApi,
  procedureId,
  searchParams,
  additionalKeyDocumentTypes,
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
    progressEntryApiQueryKey,
    procedureId,
    props.leaderRole,
    filters,
  ).data;
  const { data: response } = useGetUsersByGroupQuery(
    props.groupName,
    props.getInitOverrides,
  );

  const filterSettings = useProgressEntriesFilterSettings({
    users: response.users,
    systemProgressEntryTypes: props.systemProgressEntryTypes,
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
        approvalRequestsResponse: approvalRequestsResponse,
        searchParams,
        filterSettings,
        progressEntryApiQueryKey,
        progressEntryApi,
        procedureApi,
        ...props,
      }}
    >
      <ProgressEntriesPageComponent />
    </ProgressEntriesProvider>
  );
}

export function ProgressEntriesPageComponent() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
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
            !isOffline && <FilterButton {...filterSettings.filterButtonProps} />
          }
          right={
            !isReadOnly &&
            !isOffline && (
              <Button
                onClick={openCreateProgressEntrySidebar}
                startDecorator={<AddIcon />}
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
            data-testid="progressEntry"
            key={entryProps.key}
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
