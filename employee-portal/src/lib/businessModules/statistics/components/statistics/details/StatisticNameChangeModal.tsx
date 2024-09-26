/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

import { useEditStatisticName } from "@/lib/businessModules/statistics/api/mutations/useEditStatisticName";
import { FormDialog } from "@/lib/shared/components/formDialog/FormDialog";

interface StatisticNameChangeModalProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
}

export function StatisticNameChangeModal(props: StatisticNameChangeModalProps) {
  const editStatisticName = useEditStatisticName();

  async function onSubmit(model: { name: string }) {
    return editStatisticName(model.name).then(() => props.onClose());
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
      description="Wählen Sie einen neuen Namen für die Statistik."
      color="primary"
      confirmLabel="Speichern"
      cancelLabel="Abbrechen"
    >
      <InputField
        name="name"
        label="Name der Statistik"
        required="Bitte neuen Namen angeben."
        sx={{ marginTop: 2 }}
      />
    </FormDialog>
  );
}
