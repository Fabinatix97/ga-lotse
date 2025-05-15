/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createContext, useContext, useState } from "react";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { ApiProcedureStatus } from "@eshg/lib-procedures-api";

import { useIsOffline } from "../../../hooks/useIsOffline";
import { useHasUserRoleCheck } from "../../auth/hooks/useAccessControl";
import { ProgressEntriesConfig } from "../types/common";

interface ProgressEntriesContextProps {
  config: ProgressEntriesConfig;
  state: {
    fileIdForDeletion: string | null;
    entryIdForDeletion: string | null;
    entryIdForDetails: string | null;
  };
  action: {
    openFileDeletionModal: (fileId: string) => void;
    closeFileDeletionModal: () => void;
    openEntryDeletionModal: (entryId: string) => void;
    closeEntryDeletionModal: () => void;
    openEntryDetailsSidebar: (entryId: string) => void;
    closeEntryDetailsSidebar: () => void;
  };
}

const ProgressEntriesContext =
  createContext<ProgressEntriesContextProps | null>(null);

interface ProgressEntriesProviderProps extends RequiresChildren {
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
  const [entryIdForDetails, setEntryIdForDetails] = useState<string | null>(
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

  function openEntryDetailsSidebar(entryId: string) {
    setEntryIdForDetails(entryId);
  }

  function closeEntryDetailsSidebar() {
    setEntryIdForDetails(null);
  }

  return (
    <ProgressEntriesContext
      value={{
        config: props.progressEntriesConfig,
        state: {
          fileIdForDeletion,
          entryIdForDeletion,
          entryIdForDetails,
        },
        action: {
          openFileDeletionModal,
          closeFileDeletionModal,
          openEntryDeletionModal,
          closeEntryDeletionModal,
          openEntryDetailsSidebar,
          closeEntryDetailsSidebar,
        },
      }}
    >
      {props.children}
    </ProgressEntriesContext>
  );
}

export function useProgressEntriesContext() {
  const progressEntries = useContext(ProgressEntriesContext);

  if (progressEntries === null) {
    throw new Error("Missing ProgressEntriesContext");
  }

  return progressEntries;
}

export function useHasDeletionRights() {
  const { leaderRole } = useProgressEntriesConfig();
  return useHasUserRoleCheck(leaderRole);
}

export function useIsReadOnly() {
  const { detailedProcedure } = useProgressEntriesConfig();
  const { procedureStatus } = detailedProcedure.procedure;
  const isOffline = useIsOffline();
  return procedureStatus === ApiProcedureStatus.Closed || isOffline;
}

export function useProgressEntriesConfig() {
  return useProgressEntriesContext().config;
}
