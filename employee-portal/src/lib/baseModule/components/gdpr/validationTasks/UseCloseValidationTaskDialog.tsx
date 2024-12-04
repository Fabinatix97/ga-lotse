/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBusinessProcedureInclusionStatus,
  ApiBusinessProcedureWithInclusionStatus,
  ApiGdprProcedureType,
  GdprValidationTaskApiInterface,
} from "@eshg/employee-portal-api/businessProcedures";
import { Typography } from "@mui/joy";

import { useCloseValidationTask } from "@/lib/baseModule/api/mutations/gdpr";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

interface UseCloseValidationTaskDialogProps {
  gdprValidationTaskApi: GdprValidationTaskApiInterface;
  gdprProcedureId: string;
  gdprProcedureType: ApiGdprProcedureType;
  procedures: ApiBusinessProcedureWithInclusionStatus[];
}

export function useCloseValidationTaskDialog(
  props: UseCloseValidationTaskDialogProps,
) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const closeValidationTask = useCloseValidationTask(
    props.gdprValidationTaskApi,
    props.gdprProcedureType,
  );

  const numberOfUndecidedProcedures = countUndecided(props.procedures);

  function openCloseValidationTaskDialog() {
    openConfirmationDialog({
      title: "Auftrag abschließen",
      hideDescription: true,
      children: (
        <DialogDescription
          numberOfUndecidedProcedures={numberOfUndecidedProcedures}
        />
      ),
      onConfirm: () => closeValidationTask.mutate(props.gdprProcedureId),
    });
  }

  return { openCloseValidationTaskDialog };
}

function countUndecided(procedures: ApiBusinessProcedureWithInclusionStatus[]) {
  return procedures.filter(
    (procedure) =>
      procedure.inclusionStatus ===
      ApiBusinessProcedureInclusionStatus.Undecided,
  ).length;
}

function DialogDescription({
  numberOfUndecidedProcedures,
}: {
  numberOfUndecidedProcedures: number;
}) {
  if (numberOfUndecidedProcedures < 1) {
    return (
      <Typography>
        <strong>Alle</strong> Vorgänge werden freigegeben.
      </Typography>
    );
  } else if (numberOfUndecidedProcedures === 1) {
    return (
      <Typography>
        <strong>Ein</strong> Vorgang wurde nicht freigegeben.
      </Typography>
    );
  } else {
    return (
      <Typography>
        <strong>{numberOfUndecidedProcedures}</strong> Vorgänge wurden nicht
        freigegeben.
      </Typography>
    );
  }
}
