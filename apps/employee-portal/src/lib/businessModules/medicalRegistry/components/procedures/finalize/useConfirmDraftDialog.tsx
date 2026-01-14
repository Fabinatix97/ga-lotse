/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { ConfirmationDialogOptions } from "@eshg/lib-portal";
import {
  ApiGetProcedureDraftResponse,
  ApiPracticeReferenceFacility,
  ApiProcedureReference,
  ApiProfessionalReferencePerson,
  ApiResolvedEmployeeChange,
} from "@eshg/medical-registry-api";

import { useConfirmDraft } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";

interface ConfirmDraftParams {
  procedure: ApiGetProcedureDraftResponse;
  practiceReferenceFacility?: ApiPracticeReferenceFacility;
  professionalReferencePerson?: ApiProfessionalReferencePerson;
  target?: ApiProcedureReference;
  employeeChanges?: ApiResolvedEmployeeChange[];
}

interface ConfirmDraftDialogOptions {
  isUpdate: boolean;
  params: ConfirmDraftParams;
}

export function useConfirmDraftDialog(
  options?: Pick<ConfirmationDialogOptions, "onConfirm">,
) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const confirmDraft = useConfirmDraft();

  async function handleConfirm(params: ConfirmDraftParams) {
    confirmDraft.mutate({
      procedureId: params.procedure.id,
      apiConfirmProcedureRequest: {
        version: params.procedure.version,
        practiceReferenceFacility: params.practiceReferenceFacility,
        professionalReferencePerson: params.professionalReferencePerson,
        target: params.target,
        employeeChanges: params.employeeChanges ?? [],
      },
    });

    await options?.onConfirm?.();
  }

  return {
    open: ({ isUpdate, params }: ConfirmDraftDialogOptions) => {
      openConfirmationDialog({
        title: isUpdate ? "Eintrag aktualisieren?" : "Eintrag anlegen?",
        description: isUpdate
          ? "Möchten Sie den Eintrag mit den Formular-Daten aktualisieren? Die Aktion kann nicht rückgängig gemacht werden."
          : "Möchten Sie den Eintrag mit den Formular-Daten anlegen? Die Aktion kann nicht rückgängig gemacht werden.",
        color: "primary",
        confirmLabel: "Bestätigen",
        onConfirm: () => handleConfirm(params),
      });
    },
  };
}
