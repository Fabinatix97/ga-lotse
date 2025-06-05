/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { isDefined } from "remeda";

import {
  UseSidebarResult,
  useSidebar,
} from "../../../../drawer/hooks/useSidebar";
import { DrawerProps } from "../../../../drawer/types/drawer";
import { useFetchProgressEntryDetails } from "../../../api/queries/progressEntry";
import { useProgressEntriesConfig } from "../../../contexts/progressEntries";

import { InboxProgressEntryDetails } from "./InboxProgressEntryDetails";
import { ManualProgressEntryDetails } from "./ManualProgressEntryDetails";
import { SystemProgressEntryDetails } from "./SystemProgressEntryDetails";

export function useProgressEntryDetailsSidebar(): UseSidebarResult<ProgressEntryDetailsSidebarProps> {
  return useSidebar({
    component: ProgressEntryDetailsSidebar,
  });
}

interface ProgressEntryDetailsSidebarProps extends DrawerProps {
  progressEntryId: string;
}

function ProgressEntryDetailsSidebar(props: ProgressEntryDetailsSidebarProps) {
  const {
    procedureId,
    progressEntryApi,
    businessModule,
    getHeadersForOfflineCaching,
  } = useProgressEntriesConfig();
  const { progressEntry, relatedKeyDocumentProgressEntries, resolvedUsers } =
    useFetchProgressEntryDetails(
      progressEntryApi,
      businessModule,
      procedureId,
      props.progressEntryId,
      getHeadersForOfflineCaching,
    ).data;

  return (
    <>
      {isDefined(progressEntry) &&
        progressEntry.type === "ManualProgressEntry" && (
          <ManualProgressEntryDetails
            entry={progressEntry}
            resolvedUsers={resolvedUsers}
            relatedKeyDocumentProgressEntries={
              relatedKeyDocumentProgressEntries
            }
            onClose={() => props.onClose()}
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
    </>
  );
}
