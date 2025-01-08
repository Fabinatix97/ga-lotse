/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiGetProcedure200Response } from "@eshg/employee-portal-api/measlesProtection";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useState } from "react";
import { isNullish } from "remeda";

import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export type ReopenProcedureDetails = Pick<
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

export const ProceduresContext = createContext<ProceduresContextProps | null>(
  null,
);

export function ProceduresProvider(props: RequiresChildren) {
  const [procedureIdForDeletion, setProcedureIdForDeletion] = useState<
    string | null
  >(null);
  const [procedureForReopen, setProcedureForReopen] =
    useState<ReopenProcedureDetails | null>(null);

  function openProcedureDeletionModal(procedureId: string) {
    setProcedureIdForDeletion(procedureId);
  }

  function closeProcedureDeletionModal() {
    setProcedureIdForDeletion(null);
  }

  function openProcedureReopenModal(procedureDetails: ReopenProcedureDetails) {
    setProcedureForReopen(procedureDetails);
  }

  function closeProcedureReopenModal() {
    setProcedureForReopen(null);
  }

  return (
    <ProceduresContext.Provider
      value={{
        state: {
          procedureIdForDeletion: procedureIdForDeletion,
          procedureForReopen: procedureForReopen,
        },
        action: {
          openProcedureDeletionModal: openProcedureDeletionModal,
          closeProcedureDeletionModal: closeProcedureDeletionModal,
          openProcedureReopenModal: openProcedureReopenModal,
          closeProcedureReopenModal: closeProcedureReopenModal,
        },
      }}
    >
      {props.children}
    </ProceduresContext.Provider>
  );
}

export function useHasDeletionRights() {
  return useHasUserRoleCheck(ApiUserRole.MeaslesProtectionLeader);
}

export function useHasReopenRights() {
  return useHasUserRoleCheck(ApiUserRole.MeaslesProtectionLeader);
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
