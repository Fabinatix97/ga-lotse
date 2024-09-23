/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  ApiKeyDocumentType,
  ApiManualProgressEntry,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/businessProcedures";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useState } from "react";
import { isDefined } from "remeda";

import { buildName } from "@/lib/shared/components/procedures/progress-entries/helper";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

import { ProgressEntriesConfig, RelatedEntry } from "./types";

interface ProgressEntriesContextProps {
  config: ProgressEntriesConfig;
  state: {
    fileIdForDeletion: string | null;
    entryIdForDeletion: string | null;
  };
  action: {
    openFileDeletionModal: (fileId: string) => void;
    closeFileDeletionModal: () => void;
    openEntryDeletionModal: (entryId: string) => void;
    closeEntryDeletionModal: () => void;
  };
}

export const ProgressEntriesContext =
  createContext<ProgressEntriesContextProps>(null!);

export interface ProgressEntriesProviderProps extends RequiresChildren {
  progressEntriesConfig: ProgressEntriesConfig;
}

export function ProgressEntriesProvider(
  props: Readonly<ProgressEntriesProviderProps>,
) {
  const [fileIdForDeletion, setFileIdForDeletion] = useState<string | null>(
    null,
  );
  const [entryIdForDeletion, setEntryIdForDeletion] = useState<string | null>(
    null,
  );

  function openFileDeletionModal(fileId: string) {
    setFileIdForDeletion(fileId);
  }

  function closeFileDeletionModal() {
    setFileIdForDeletion(null);
  }

  function openEntryDeletionModal(entryId: string) {
    setEntryIdForDeletion(entryId);
  }

  function closeEntryDeletionModal() {
    setEntryIdForDeletion(null);
  }

  return (
    <ProgressEntriesContext.Provider
      value={{
        config: props.progressEntriesConfig,
        state: {
          fileIdForDeletion,
          entryIdForDeletion,
        },
        action: {
          openFileDeletionModal,
          closeFileDeletionModal,
          openEntryDeletionModal,
          closeEntryDeletionModal,
        },
      }}
    >
      {props.children}
    </ProgressEntriesContext.Provider>
  );
}

export function useUndeletedFilesWithoutOldVersions() {
  const { progressEntries, files } = useContext(ProgressEntriesContext).config;
  const undeletedFiles = files.filter((file) => !file.file.deleted);

  interface KeyDocumentFile {
    keyDocumentType: ApiKeyDocumentType;
    keyDocumentVersion: number;
    progressEntryId: string;
  }

  const allKeyDocumentFiles = progressEntries
    .filter(
      (entry) =>
        entry.fileReference &&
        !entry.fileReference.deleted &&
        entry.type === "ManualProgressEntry" &&
        isDefined(entry.keyDocumentType) &&
        isDefined(entry.keyDocumentVersion),
    )
    .map((entry) => entry as ApiManualProgressEntry)
    .map((entry) => {
      return {
        keyDocumentType: entry.keyDocumentType,
        keyDocumentVersion: entry.keyDocumentVersion,
        progressEntryId: entry.progressEntryId,
      } as KeyDocumentFile;
    });

  const latestKeyDocumentFilesGroupedByType = allKeyDocumentFiles.reduce(
    (accumulated, entry) => {
      const { keyDocumentType, keyDocumentVersion, progressEntryId } = entry;
      const current = accumulated[keyDocumentType];

      if (!current || keyDocumentVersion > current.keyDocumentVersion) {
        accumulated[keyDocumentType] = {
          keyDocumentType,
          keyDocumentVersion,
          progressEntryId,
        };
      }

      return accumulated;
    },
    {} as Record<ApiKeyDocumentType, KeyDocumentFile>,
  );

  const latestKeyDocumentProgressEntryIds = Object.values(
    latestKeyDocumentFilesGroupedByType,
  ).map((file) => file.progressEntryId);

  const ignoredProgressEntryIds = allKeyDocumentFiles
    .map((file) => file.progressEntryId)
    .filter(
      (progressEntryId) =>
        !latestKeyDocumentProgressEntryIds.includes(progressEntryId),
    );

  return undeletedFiles.filter(
    ({ progressEntryId }) => !ignoredProgressEntryIds.includes(progressEntryId),
  );
}

export function useHasDeletionRights() {
  const { leaderRole } = useContext(ProgressEntriesContext).config;
  return useHasUserRoleCheck(leaderRole);
}

export function useIsReadOnly() {
  const { detailedProcedure } = useContext(ProgressEntriesContext).config;
  const { procedureStatus } = detailedProcedure.procedure;
  const isOffline = useIsOffline();
  return procedureStatus === ApiProcedureStatus.Closed || isOffline;
}

export function useProgressEntriesConfig() {
  return useContext(ProgressEntriesContext).config;
}

export function useOpenApprovalRequests() {
  const { approvalRequestsResponse } = useContext(
    ProgressEntriesContext,
  ).config;
  return approvalRequestsResponse?.approvalRequests;
}

export function useResolvedUserName(userId: string) {
  const { approvalRequestsResponse } = useContext(
    ProgressEntriesContext,
  ).config;
  const user = approvalRequestsResponse?.resolvedUsers?.[userId];
  return buildName(user?.firstName, user?.lastName);
}

export function useFilteredAndSortedRelatedEntries(
  relatedKeyDocumentProgressEntries: ApiManualProgressEntry[],
) {
  return relatedKeyDocumentProgressEntries
    .filter(hasUndeletedFileAndKeyDocumentVersion)
    .toSorted(
      (entry1, entry2) => entry2.keyDocumentVersion - entry1.keyDocumentVersion,
    );
}

function hasUndeletedFileAndKeyDocumentVersion(
  entry: ApiManualProgressEntry,
): entry is RelatedEntry {
  return (
    isDefined(entry.fileReference) &&
    !entry.fileReference.deleted &&
    entry.fileReference.type !== "GenericFileReference" &&
    isDefined(entry.keyDocumentVersion)
  );
}
