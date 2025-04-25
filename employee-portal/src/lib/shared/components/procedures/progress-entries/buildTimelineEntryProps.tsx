/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import CheckIcon from "@mui/icons-material/Check";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useContext } from "react";
import { isDefined, isEmpty } from "remeda";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatUserName } from "@eshg/lib-portal/formatters/person";
import {
  ApiGetProgressEntriesResponseProgressEntriesInner,
  ApiManualProgressEntry,
  ApiProcessedInboxProgressEntry,
  ApiSystemProgressEntry,
  ApiUser,
} from "@eshg/lib-procedures-api";

import {
  ProgressEntriesContext,
  useProgressEntriesConfig,
} from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
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
import { formatTriggeredBy } from "./helper";

interface ProgressEntryTimelineEntryProps extends TimelineEntryProps {
  key: string;
}

export function useTimelineEntryProps(): ProgressEntryTimelineEntryProps[] {
  const { progressEntries, resolvedUsers } =
    useProgressEntriesConfig().progressEntries;

  return progressEntries.map((progressEntry) =>
    timelineEntryPropsOfProgressEntry(progressEntry, resolvedUsers),
  );
}

function timelineEntryPropsOfProgressEntry(
  progressEntry: ApiGetProgressEntriesResponseProgressEntriesInner,
  resolvedUsers: Record<string, ApiUser>,
): ProgressEntryTimelineEntryProps {
  switch (progressEntry.type) {
    case "SystemProgressEntry":
      return timelineEntryPropsOfSystemProgressEntry(
        progressEntry,
        resolvedUsers,
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
        ] ?? <CheckIcon />}
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
        <MailOutlinedIcon />
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
  const progressEntriesContext = useContext(ProgressEntriesContext);
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
