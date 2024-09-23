/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { DeleteOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useGetUsersByGroupQuery } from "@/lib/baseModule/api/queries/users";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";
import { useDeletionProps } from "@/lib/shared/components/procedures/progress-entries/hooks/useDeletionProps";
import { useProgressEntriesFilterSettings } from "@/lib/shared/components/procedures/progress-entries/hooks/useProgressEntriesFilterSettings";
import { ApprovalRequestsOverviewSidebar } from "@/lib/shared/components/procedures/progress-entries/sidebars/approvalRequestOverviewSidebar/ApprovalRequestsOverviewSidebar";
import { Timeline } from "@/lib/shared/components/timeline/Timeline";
import { TimelineEntry } from "@/lib/shared/components/timeline/TimelineEntry";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

import { FileCardWithActions } from "./FileCardWithActions";
import {
  ProgressEntriesProvider,
  useHasDeletionRights,
  useIsReadOnly,
  useOpenApprovalRequests,
  useProgressEntriesConfig,
  useUndeletedFilesWithoutOldVersions,
} from "./ProgressEntriesContext";
import { SortSelect } from "./SortSelect";
import { timelineEntryProps } from "./buildTimelineEntryProps";
import { CreateProgressEntrySidebar } from "./sidebars/CreateProgressEntrySidebar";
import { FilesSidebar } from "./sidebars/FilesSidebar";
import { ProgressEntryDetailsSidebar } from "./sidebars/progressEntryDetailsSidebar/ProgressEntryDetailsSidebar";
import { ProgressEntriesFilters, ProgressEntriesPageProps } from "./types";

export function ProgressEntriesPage({
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  urlParams,
  ...props
}: ProgressEntriesPageProps) {
  const procedureId = urlParams.params.id;
  const [filters, setFilters] = useState<ProgressEntriesFilters>({});

  const {
    progressEntries,
    detailedProcedure,
    files,
    approvalRequestsResponse,
  } = useFetchProgressEntries(procedureId, props.leaderRole, filters).data;
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
        approvalRequestsResponse: approvalRequestsResponse,
        searchParams: urlParams.searchParams,
        filterSettings,
        useFetchProgressEntryDetails,
        ...props,
      }}
    >
      <ProgressEntriesPageComponent />
    </ProgressEntriesProvider>
  );
}

export function ProgressEntriesPageComponent() {
  const { filterSettings, routes, useFetchProgressEntryDetails } =
    useProgressEntriesConfig();
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

  const { entryId } = useParams<{
    entryId: string;
  }>();

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
      {entryId ? (
        <ProgressEntryDetailsSidebar
          route={routes.progressEntries}
          useFetchProgressEntryDetails={useFetchProgressEntryDetails}
        />
      ) : undefined}
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
  const { procedureId, searchParams, progressEntries, files, routes } =
    useProgressEntriesConfig();
  const rawSearchParams = useSearchParams();

  const approvalRequests = useOpenApprovalRequests();
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
      <Stack direction="row" justifyContent="space-between">
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
        {progressEntries.map((entry) => (
          <TimelineEntry
            data-testid="progressEntry"
            key={entry.progressEntryId}
            {...timelineEntryProps(
              entry,
              files,
              (entryId) => routes.entryDetails(procedureId, entryId),
              rawSearchParams,
            )}
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
  const undeletedFiles = useUndeletedFilesWithoutOldVersions();

  return (
    <Sheet data-testid="files">
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
        <Typography level="title-md" marginTop={0.5}>
          {`Dateien (${undeletedFiles.length})`}
        </Typography>
        <Button variant="plain" size="sm" onClick={openFilesSidebar}>
          Alle anzeigen
        </Button>
      </Stack>
      <Stack spacing={1}>
        {undeletedFiles
          .reverse()
          .slice(0, 5)
          .map(({ file, progressEntryId }) => (
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
