/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

import { useEditEvaluationName } from "@/lib/businessModules/statistics/api/mutations/useEditEvaluationName";
import { FormDialog } from "@/lib/shared/components/formDialog/FormDialog";

interface EvaluationNameChangeModalProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
  evaluationId: string;
}

export function EvaluationNameChangeModal(
  props: EvaluationNameChangeModalProps,
) {
  const editEvaluationName = useEditEvaluationName(props.evaluationId);

  async function onSubmit(model: { name: string }) {
    return editEvaluationName(model.name).then(() => props.onClose());
  }

  return (
    <FormDialog
      open={props.open}
      onClose={props.onClose}
      onSubmit={onSubmit}
      initialValues={{
        name: props.initialName,
      }}
      title="Name ändern"
      description="Wählen Sie einen neuen Namen für die Auswertung."
      color="primary"
      confirmLabel="Speichern"
      cancelLabel="Abbrechen"
    >
      <InputField
        name="name"
        label="Name der Auswertung"
        required="Bitte neuen Namen angeben."
        sx={{ marginTop: 2 }}
      />
    </FormDialog>
  );
}
