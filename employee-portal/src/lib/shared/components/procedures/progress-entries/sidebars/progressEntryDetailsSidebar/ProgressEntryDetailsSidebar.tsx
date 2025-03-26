/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Sidebar } from "@eshg/lib-employee-portal";
import { useContext } from "react";
import { isDefined } from "remeda";

import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useFetchProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/queries/progressEntryApi";
import { InboxProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/InboxProgressEntryDetails";
import { ManualProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/ManualProgressEntryDetails";
import { SystemProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/SystemProgressEntryDetails";

interface ProgressEntryDetailsSidebarProps {
  progressEntryId: string;
}

export function ProgressEntryDetailsSidebar({
  progressEntryId,
}: ProgressEntryDetailsSidebarProps) {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { procedureId, progressEntryApi, progressEntryApiQueryKey } =
    progressEntriesContext.config;
  const { closeEntryDetailsSidebar } = progressEntriesContext.action;
  const { progressEntry, relatedKeyDocumentProgressEntries, resolvedUsers } =
    useFetchProgressEntryDetails(
      progressEntryApi,
      progressEntryApiQueryKey,
      procedureId,
      progressEntryId,
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
