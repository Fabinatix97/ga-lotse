/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetProgressEntriesResponseProgressEntriesInner,
  ApiManualProgressEntry,
  ApiProcessedInboxProgressEntry,
  ApiProgressEntryReferenceFilePair,
  ApiSystemProgressEntry,
} from "@eshg/employee-portal-api/businessProcedures";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import CheckIcon from "@mui/icons-material/Check";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { isDefined, isEmpty } from "remeda";

import { buildRouteWithParams } from "@/lib/shared/components/procedures/helper";
import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { TimelineEntryProps } from "@/lib/shared/components/timeline/TimelineEntry";
import { TimelineEntryIndicator } from "@/lib/shared/components/timeline/TimelineEntryIndicator";

import { EntryFile } from "./EntryFile";
import {
  inboxProgressEntryTitles,
  manualProgressEntryIndicators,
  manualProgressEntryTitles,
  systemProgressEntryIndicators,
  systemProgressEntryTypeTitles,
} from "./constants";
import { buildName, displayTriggerer, resolveFileId } from "./helper";

interface ProgressEntryTimelineEntryProps extends TimelineEntryProps {
  key: string;
}

export function useTimelineEntryProps(): ProgressEntryTimelineEntryProps[] {
  const { procedureId, progressEntries, files, routes } =
    useProgressEntriesConfig();
  const rawSearchParams = useSearchParams();

  return progressEntries.map((progressEntry) =>
    timelineEntryPropsOfProgressEntry(
      progressEntry,
      files,
      buildRouteWithParams(
        routes.entryDetails(procedureId, progressEntry.progressEntryId),
        rawSearchParams,
      ),
    ),
  );
}

function timelineEntryPropsOfProgressEntry(
  progressEntry: ApiGetProgressEntriesResponseProgressEntriesInner,
  files: ApiProgressEntryReferenceFilePair[],
  detailsUrl: string,
): ProgressEntryTimelineEntryProps {
  const progressEntryFilePair =
    isDefined(progressEntry.fileReference) &&
    isDefined(progressEntry.fileReference.fileId)
      ? resolveFileId(progressEntry.fileReference.fileId, files)
      : undefined;

  switch (progressEntry.type) {
    case "SystemProgressEntry":
      return timelineEntryPropsOfSystemProgressEntry(
        progressEntry,
        progressEntryFilePair,
        detailsUrl,
      );
    case "ManualProgressEntry":
      return timelineEntryPropsOfManualProgressEntry(
        progressEntry,
        progressEntryFilePair,
        detailsUrl,
      );
    case "ProcessedInboxProgressEntry":
      return timelineEntryPropsOfInboxProgressEntry(
        progressEntry,
        progressEntryFilePair,
        detailsUrl,
      );
  }
}

function TextSheet(props: { text: string; dataTestId: string }) {
  return (
    <Stack direction="row">
      <Sheet variant="soft" color="neutral" data-testid={props.dataTestId}>
        <Typography level="body-xs" whiteSpace="pre-wrap">
          {props.text}
        </Typography>
      </Sheet>
    </Stack>
  );
}

function timelineEntryPropsOfSystemProgressEntry(
  systemProgressEntry: ApiSystemProgressEntry,
  progressEntryReferenceFilePair: ApiProgressEntryReferenceFilePair | undefined,
  detailsUrl: string,
): ProgressEntryTimelineEntryProps {
  return {
    key: systemProgressEntry.progressEntryId,
    title: (
      <Title
        title={
          systemProgressEntryTypeTitles[
            systemProgressEntry.systemProgressEntryType
          ] ?? "Unbekannt"
        }
        detailsUrl={detailsUrl}
      />
    ),
    label: buildLabel(
      systemProgressEntry.createdAt,
      displayTriggerer(systemProgressEntry),
    ),
    indicator: (
      <TimelineEntryIndicator color="success">
        {systemProgressEntryIndicators[
          systemProgressEntry.systemProgressEntryType
        ] ?? <CheckIcon />}
      </TimelineEntryIndicator>
    ),
    children: (
      <>
        <EntryFile
          progressEntryReferenceFilePair={progressEntryReferenceFilePair}
        />
        {!isEmpty(systemProgressEntry.changeDescription) && (
          <TextSheet
            text={systemProgressEntry.changeDescription}
            dataTestId="changeDescription"
          />
        )}
      </>
    ),
  };
}

function timelineEntryPropsOfManualProgressEntry(
  manualProgressEntry: ApiManualProgressEntry,
  progressEntryReferenceFilePair: ApiProgressEntryReferenceFilePair | undefined,
  detailsUrl: string,
): ProgressEntryTimelineEntryProps {
  const note = manualProgressEntry.note;
  return {
    key: manualProgressEntry.progressEntryId,
    title: (
      <Title
        title={
          manualProgressEntryTitles[manualProgressEntry.manualProgressEntryType]
        }
        detailsUrl={detailsUrl}
      />
    ),
    label: buildLabel(
      manualProgressEntry.createdAt,
      buildName(
        manualProgressEntry.createdByUserFirstName,
        manualProgressEntry.createdByUserLastName,
      ),
    ),
    indicator: (
      <TimelineEntryIndicator>
        {
          manualProgressEntryIndicators[
            manualProgressEntry.manualProgressEntryType
          ]
        }
      </TimelineEntryIndicator>
    ),
    children: (
      <>
        <EntryFile
          progressEntryReferenceFilePair={progressEntryReferenceFilePair}
        />
        {isDefined(note) && <TextSheet text={note} dataTestId="noteDisplay" />}
      </>
    ),
  };
}

function timelineEntryPropsOfInboxProgressEntry(
  inboxProgressEntry: ApiProcessedInboxProgressEntry,
  progressEntryReferenceFilePair: ApiProgressEntryReferenceFilePair | undefined,
  detailsUrl: string,
): ProgressEntryTimelineEntryProps {
  return {
    key: inboxProgressEntry.progressEntryId,
    title: (
      <Title
        title={
          inboxProgressEntryTitles[inboxProgressEntry.inboxProgressEntryType]
        }
        detailsUrl={detailsUrl}
      />
    ),
    label: buildLabel(
      inboxProgressEntry.createdAt,
      buildName(
        inboxProgressEntry.createdByUserFirstName,
        inboxProgressEntry.createdByUserLastName,
      ),
    ),
    indicator: (
      <TimelineEntryIndicator>
        <MailOutlinedIcon />
      </TimelineEntryIndicator>
    ),
    children: (
      <EntryFile
        progressEntryReferenceFilePair={progressEntryReferenceFilePair}
      />
    ),
  };
}

function Title({ title, detailsUrl }: { title: string; detailsUrl: string }) {
  return (
    <Stack direction="row" spacing={0.75}>
      <Typography>{title}</Typography>
      <InternalLink level="body-sm" href={detailsUrl}>
        Details
      </InternalLink>
    </Stack>
  );
}

function buildLabel(date: Date, user: string) {
  return `${formatDateTime(date)}, ${user}`;
}
