/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { isDefined } from "remeda";

import { Sidebar } from "../../../../drawer/components/Sidebar";
import { useFetchProgressEntryDetails } from "../../../api/queries/progressEntry";
import { useProgressEntriesContext } from "../../../contexts/progressEntries";

import { InboxProgressEntryDetails } from "./InboxProgressEntryDetails";
import { ManualProgressEntryDetails } from "./ManualProgressEntryDetails";
import { SystemProgressEntryDetails } from "./SystemProgressEntryDetails";

interface ProgressEntryDetailsSidebarProps {
  progressEntryId: string;
}

export function ProgressEntryDetailsSidebar({
  progressEntryId,
}: ProgressEntryDetailsSidebarProps) {
  const progressEntriesContext = useProgressEntriesContext();
  const { procedureId, progressEntryApi, businessModule } =
    progressEntriesContext.config;
  const { closeEntryDetailsSidebar } = progressEntriesContext.action;
  const { progressEntry, relatedKeyDocumentProgressEntries, resolvedUsers } =
    useFetchProgressEntryDetails(
      progressEntryApi,
      businessModule,
      procedureId,
      progressEntryId,
      progressEntriesContext.config.getHeadersForOfflineCaching,
    ).data;

  return (
    <Sidebar open onClose={closeEntryDetailsSidebar}>
      {isDefined(progressEntry) &&
        progressEntry.type === "ManualProgressEntry" && (
          <ManualProgressEntryDetails
            entry={progressEntry}
            resolvedUsers={resolvedUsers}
            relatedKeyDocumentProgressEntries={
              relatedKeyDocumentProgressEntries
            }
            onClose={closeEntryDetailsSidebar}
          />
        )}
      {isDefined(progressEntry) &&
        progressEntry.type === "SystemProgressEntry" && (
          <SystemProgressEntryDetails
            entry={progressEntry}
            resolvedUsers={resolvedUsers}
            relatedKeyDocumentProgressEntries={
              relatedKeyDocumentProgressEntries
            }
          />
        )}
      {isDefined(progressEntry) &&
        progressEntry.type === "ProcessedInboxProgressEntry" && (
          <InboxProgressEntryDetails
            entry={progressEntry}
            resolvedUsers={resolvedUsers}
          />
        )}
    </Sidebar>
  );
}
