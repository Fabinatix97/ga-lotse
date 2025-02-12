/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfirmationDialogOptions } from "@eshg/lib-portal/components/confirmationDialog/ConfirmationDialogProvider";
import {
  ApiGetProcedureDraftResponse,
  ApiPracticeReferenceFacility,
  ApiProcedureReference,
  ApiProfessionalReferencePerson,
} from "@eshg/medical-registry-api";

import { useConfirmDraft } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface ConfirmDraftParams {
  procedure: ApiGetProcedureDraftResponse;
  practiceReferenceFacility?: ApiPracticeReferenceFacility;
  professionalReferencePerson?: ApiProfessionalReferencePerson;
  target?: ApiProcedureReference;
}

interface ConfirmDraftDialogOptions {
  isUpdate: boolean;
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
      },
    });

    await options?.onConfirm?.();
  }

  return {
    open: (
      { isUpdate }: ConfirmDraftDialogOptions,
      params: ConfirmDraftParams,
    ) => {
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
