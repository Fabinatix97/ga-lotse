/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetProcedureDraftResponse,
  ApiPracticeReferenceFacility,
  ApiProcedureReference,
  ApiProfessionalReferencePerson,
} from "@eshg/employee-portal-api/medicalRegistry";

import { useConfirmDraft } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import {
  ConfirmationDialogOptions,
  useConfirmationDialog,
} from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

interface ConfirmDraftParams {
  procedure: ApiGetProcedureDraftResponse;
  practiceReferenceFacility?: ApiPracticeReferenceFacility;
  professionalReferencePerson?: ApiProfessionalReferencePerson;
  target?: ApiProcedureReference;
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
    open: (params: ConfirmDraftParams) => {
      openConfirmationDialog({
        title: "Eintrag anlegen?",
        description:
          "Möchten Sie den Eintrag mit den Formular-Daten anlegen? Die Aktion kann nicht rückgängig gemacht werden.",
        color: "primary",
        confirmLabel: "Bestätigen",
        onConfirm: () => handleConfirm(params),
      });
    },
  };
}
