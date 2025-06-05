/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isNullish } from "remeda";

import { RequiresChildren } from "@eshg/lib-portal";
import { ApiGetProcedure200Response } from "@eshg/measles-protection-api";

type ReopenProcedureDetails = Pick<
  ApiGetProcedure200Response,
  "id" | "affectedPerson"
>;

interface ProceduresContextProps {
  state: {
    procedureIdForDeletion: string | null;
    procedureForReopen: ReopenProcedureDetails | null;
  };
  action: {
    openProcedureDeletionModal: (procedureId: string) => void;
    closeProcedureDeletionModal: () => void;
    openProcedureReopenModal: (
      procedureDetails: ReopenProcedureDetails,
    ) => void;
    closeProcedureReopenModal: () => void;
  };
}

const ProceduresContext = createContext<ProceduresContextProps | null>(null);

export function ProceduresProvider(props: RequiresChildren) {
  const [procedureIdForDeletion, setProcedureIdForDeletion] = useState<
    string | null
  >(null);
  const [procedureForReopen, setProcedureForReopen] =
    useState<ReopenProcedureDetails | null>(null);

  const openProcedureDeletionModal = useCallback(
    (procedureId: string) => setProcedureIdForDeletion(procedureId),
    [setProcedureIdForDeletion],
  );

  const closeProcedureDeletionModal = useCallback(
    () => setProcedureIdForDeletion(null),
    [setProcedureIdForDeletion],
  );

  const openProcedureReopenModal = useCallback(
    (procedureDetails: ReopenProcedureDetails) =>
      setProcedureForReopen(procedureDetails),
    [setProcedureForReopen],
  );

  const closeProcedureReopenModal = useCallback(
    () => setProcedureForReopen(null),
    [setProcedureForReopen],
  );

  const contextValue = useMemo<ProceduresContextProps>(
    () => ({
      state: {
        procedureIdForDeletion,
        procedureForReopen,
      },
      action: {
        openProcedureDeletionModal,
        closeProcedureDeletionModal,
        openProcedureReopenModal,
        closeProcedureReopenModal,
      },
    }),
    [
      procedureIdForDeletion,
      procedureForReopen,
      openProcedureDeletionModal,
      closeProcedureDeletionModal,
      openProcedureReopenModal,
      closeProcedureReopenModal,
    ],
  );

  return (
    <ProceduresContext value={contextValue}>{props.children}</ProceduresContext>
  );
}

export function useProceduresContext() {
  const proceduresContext = useContext(ProceduresContext);

  if (isNullish(proceduresContext)) {
    throw new Error(
      "useProceduresContext was called outside ProceduresProvider",
    );
  }

  return proceduresContext;
}
