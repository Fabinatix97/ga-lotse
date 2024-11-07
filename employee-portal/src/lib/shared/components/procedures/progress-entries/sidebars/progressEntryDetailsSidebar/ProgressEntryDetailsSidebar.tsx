/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiGetProgressEntryResponse } from "@eshg/employee-portal-api/businessProcedures";
import { UseSuspenseQueryResult } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { InboxProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/InboxProgressEntryDetails";
import { ManualProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/ManualProgressEntryDetails";
import { SystemProgressEntryDetails } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/SystemProgressEntryDetails";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";

interface ProgressEntryDetailsSidebarProps {
  route: (procedureId: string, entryId: string) => string;
  useFetchProgressEntryDetails: (
    procedureId: string,
    entryId: string,
  ) => UseSuspenseQueryResult<ApiGetProgressEntryResponse>;
}

export function ProgressEntryDetailsSidebar({
  route,
  useFetchProgressEntryDetails,
}: Readonly<ProgressEntryDetailsSidebarProps>) {
  const { id, entryId } = useParams<{
    id: string;
    entryId: string;
  }>();
  const { progressEntry, relatedKeyDocumentProgressEntries } =
    useFetchProgressEntryDetails(id, entryId).data;
  const router = useRouter();
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();

  function onClose() {
    router.push(buildRoutePreservingSearchParams(route(id, entryId)));
  }

  return (
    <OverlayBoundary>
      <Sidebar open={isDefined(progressEntry)} onClose={onClose}>
        {isDefined(progressEntry) &&
          progressEntry.type === "ManualProgressEntry" && (
            <ManualProgressEntryDetails
              entry={progressEntry}
              relatedKeyDocumentProgressEntries={
                relatedKeyDocumentProgressEntries
              }
              onClose={onClose}
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
    </OverlayBoundary>
  );
}
