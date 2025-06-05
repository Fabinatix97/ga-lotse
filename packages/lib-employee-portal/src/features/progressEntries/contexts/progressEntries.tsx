/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { RequiresChildren } from "@eshg/lib-portal";
import { ApiProcedureStatus } from "@eshg/lib-procedures-api";

import { useIsOffline } from "../../../hooks/useIsOffline";
import { useHasUserRoleCheck } from "../../auth/hooks/useAccessControl";
import { ProgressEntriesConfig } from "../types/common";

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

const ProgressEntriesContext =
  createContext<ProgressEntriesContextProps | null>(null);

interface ProgressEntriesProviderProps extends RequiresChildren {
  progressEntriesConfig: ProgressEntriesConfig;
}

export function ProgressEntriesProvider(
  props: Readonly<ProgressEntriesProviderProps>,
) {
  const { progressEntriesConfig, children } = props;
  const [fileIdForDeletion, setFileIdForDeletion] = useState<string | null>(
    null,
  );
  const [entryIdForDeletion, setEntryIdForDeletion] = useState<string | null>(
    null,
  );

  const openFileDeletionModal = useCallback(
    (fileId: string) => {
      setFileIdForDeletion(fileId);
    },
    [setFileIdForDeletion],
  );

  const closeFileDeletionModal = useCallback(() => {
    setFileIdForDeletion(null);
  }, [setFileIdForDeletion]);

  const openEntryDeletionModal = useCallback(
    (entryId: string) => {
      setEntryIdForDeletion(entryId);
    },
    [setEntryIdForDeletion],
  );

  const closeEntryDeletionModal = useCallback(() => {
    setEntryIdForDeletion(null);
  }, [setEntryIdForDeletion]);

  const contextValue = useMemo<ProgressEntriesContextProps>(
    () => ({
      config: progressEntriesConfig,
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
    }),
    [
      progressEntriesConfig,
      fileIdForDeletion,
      entryIdForDeletion,
      openFileDeletionModal,
      closeFileDeletionModal,
      openEntryDeletionModal,
      closeEntryDeletionModal,
    ],
  );

  return (
    <ProgressEntriesContext value={contextValue}>
      {children}
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
