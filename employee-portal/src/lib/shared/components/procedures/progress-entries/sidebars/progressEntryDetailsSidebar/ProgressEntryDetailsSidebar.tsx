/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useContext } from "react";
import { isDefined } from "remeda";

import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { InboxProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/InboxProgressEntryDetails";
import { ManualProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/ManualProgressEntryDetails";
import { SystemProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/SystemProgressEntryDetails";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";

interface ProgressEntryDetailsSidebarProps {
  progressEntryId: string;
}

export function ProgressEntryDetailsSidebar({
  progressEntryId,
}: ProgressEntryDetailsSidebarProps) {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { procedureId, useFetchProgressEntryDetails } =
    progressEntriesContext.config;
  const { closeEntryDetailsSidebar } = progressEntriesContext.action;
  const { progressEntry, relatedKeyDocumentProgressEntries } =
    useFetchProgressEntryDetails(procedureId, progressEntryId).data;

  return (
    <Sidebar open onClose={closeEntryDetailsSidebar}>
      {isDefined(progressEntry) &&
        progressEntry.type === "ManualProgressEntry" && (
          <ManualProgressEntryDetails
            entry={progressEntry}
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
            relatedKeyDocumentProgressEntries={
              relatedKeyDocumentProgressEntries
            }
          />
        )}
      {isDefined(progressEntry) &&
        progressEntry.type === "ProcessedInboxProgressEntry" && (
          <InboxProgressEntryDetails entry={progressEntry} />
        )}
    </Sidebar>
  );
}
