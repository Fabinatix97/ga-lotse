/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, MailOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { isDefined, isEmpty } from "remeda";

import { ButtonLink, formatDateTime, formatUserName } from "@eshg/lib-portal";
import {
  ApiGetProgressEntriesResponseProgressEntriesInner,
  ApiManualProgressEntry,
  ApiProcessedInboxProgressEntry,
  ApiSystemProgressEntry,
  ApiUser,
} from "@eshg/lib-procedures-api";

import { TimelineEntryProps } from "../../../components/timeline/TimelineEntry";
import { TimelineEntryIndicator } from "../../../components/timeline/TimelineEntryIndicator";
import { EntryFile } from "../components/EntryFile";
import {
  inboxProgressEntryTitles,
  manualProgressEntryIndicators,
  manualProgressEntryTitles,
  systemProgressEntryIndicators,
} from "../config/progressEntryTypes";
import {
  useProgressEntriesConfig,
  useProgressEntriesContext,
} from "../contexts/progressEntries";

import { formatTriggeredBy } from "./helper";

interface ProgressEntryTimelineEntryProps extends TimelineEntryProps {
  key: string;
}

export function useTimelineEntryProps(): ProgressEntryTimelineEntryProps[] {
  const { progressEntries: progressEntriesResponse, progressEntryTypes } =
    useProgressEntriesConfig();
  const { progressEntries, resolvedUsers } = progressEntriesResponse;

  return progressEntries.map((progressEntry) =>
    timelineEntryPropsOfProgressEntry(
      progressEntry,
      resolvedUsers,
      progressEntryTypes,
    ),
  );
}

function timelineEntryPropsOfProgressEntry(
  progressEntry: ApiGetProgressEntriesResponseProgressEntriesInner,
  resolvedUsers: Record<string, ApiUser>,
  progressEntryTypes: Record<string, string>,
): ProgressEntryTimelineEntryProps {
  switch (progressEntry.type) {
    case "SystemProgressEntry":
      return timelineEntryPropsOfSystemProgressEntry(
        progressEntry,
        resolvedUsers,
        progressEntryTypes,
      );
    case "ManualProgressEntry":
      return timelineEntryPropsOfManualProgressEntry(
        progressEntry,
        resolvedUsers,
      );
    case "ProcessedInboxProgressEntry":
      return timelineEntryPropsOfInboxProgressEntry(
        progressEntry,
        resolvedUsers,
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
  resolvedUsers: Record<string, ApiUser>,
  progressEntryTypes: Record<string, string>,
): ProgressEntryTimelineEntryProps {
  return {
    key: systemProgressEntry.progressEntryId,
    title: (
      <Title
        title={
          progressEntryTypes[systemProgressEntry.systemProgressEntryType] ??
          "Unbekannt"
        }
        progressEntryId={systemProgressEntry.progressEntryId}
      />
    ),
    label: buildLabel(
      systemProgressEntry.createdAt,
      formatTriggeredBy(systemProgressEntry, resolvedUsers),
    ),
    indicator: (
      <TimelineEntryIndicator color="success">
        {systemProgressEntryIndicators[
          systemProgressEntry.systemProgressEntryType
        ] ?? <Check />}
      </TimelineEntryIndicator>
    ),
    children: (
      <>
        <EntryFile
          progressEntryId={systemProgressEntry.progressEntryId}
          fileReference={systemProgressEntry.fileReference}
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
  resolvedUsers: Record<string, ApiUser>,
): ProgressEntryTimelineEntryProps {
  const note = manualProgressEntry.note;
  return {
    key: manualProgressEntry.progressEntryId,
    title: (
      <Title
        title={
          manualProgressEntryTitles[manualProgressEntry.manualProgressEntryType]
        }
        progressEntryId={manualProgressEntry.progressEntryId}
      />
    ),
    label: buildLabel(
      manualProgressEntry.createdAt,
      formatUserName(resolvedUsers[manualProgressEntry.createdBy]),
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
          progressEntryId={manualProgressEntry.progressEntryId}
          fileReference={manualProgressEntry.fileReference}
        />
        {isDefined(note) && <TextSheet text={note} dataTestId="noteDisplay" />}
      </>
    ),
  };
}

function timelineEntryPropsOfInboxProgressEntry(
  inboxProgressEntry: ApiProcessedInboxProgressEntry,
  resolvedUsers: Record<string, ApiUser>,
): ProgressEntryTimelineEntryProps {
  return {
    key: inboxProgressEntry.progressEntryId,
    title: (
      <Title
        title={
          inboxProgressEntryTitles[inboxProgressEntry.inboxProgressEntryType]
        }
        progressEntryId={inboxProgressEntry.progressEntryId}
      />
    ),
    label: buildLabel(
      inboxProgressEntry.createdAt,
      formatUserName(resolvedUsers[inboxProgressEntry.createdBy]),
    ),
    indicator: (
      <TimelineEntryIndicator>
        <MailOutlined />
      </TimelineEntryIndicator>
    ),
    children: (
      <EntryFile
        progressEntryId={inboxProgressEntry.progressEntryId}
        fileReference={inboxProgressEntry.fileReference}
      />
    ),
  };
}

function Title({
  title,
  progressEntryId,
}: {
  title: string;
  progressEntryId: string;
}) {
  const progressEntriesContext = useProgressEntriesContext();
  const { openEntryDetailsSidebar } = progressEntriesContext.action;

  return (
    <Stack direction="row" spacing={0.75}>
      <Typography>{title}</Typography>
      <ButtonLink
        level="body-sm"
        onClick={() => openEntryDetailsSidebar(progressEntryId)}
      >
        Details
      </ButtonLink>
    </Stack>
  );
}

function buildLabel(date: Date, user: string) {
  return `${formatDateTime(date)}, ${user}`;
}
