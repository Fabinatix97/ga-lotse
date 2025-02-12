/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiReasonForAbsence,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import { ChildExamination } from "@eshg/dental/api/models/ChildExamination";
import { useUpdateExamination } from "@eshg/dental/api/mutations/childApi";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  buildEnumOptions,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { isDefined } from "remeda";

import { FormDialog } from "@/lib/shared/components/formDialog/FormDialog";

const ABSENCE_VALUES: Record<ApiReasonForAbsence, string> = {
  [ApiReasonForAbsence.NotAppeared]: "Nicht erschienen",
  [ApiReasonForAbsence.Refused]: "Verweigert",
  [ApiReasonForAbsence.Shifted]: "Versetzt",
  [ApiReasonForAbsence.Moved]: "Umgezogen",
};

const ABSENCE_OPTIONS = buildEnumOptions(ABSENCE_VALUES);

interface ReasonForAbsenceFormValues {
  reasonForAbsence: OptionalFieldValue<ApiReasonForAbsence>;
}

interface ChangeReasonForAbsenceModalProps {
  onClose: () => void;
  examination: ChildExamination;
}

export function ChangeReasonForAbsenceModal(
  props: ChangeReasonForAbsenceModalProps,
) {
  const updateExamination = useUpdateExamination(
    props.examination.examinationId,
  );

  async function onSubmit(values: ReasonForAbsenceFormValues) {
    await updateExamination.mutateAsync(
      mapToRequest(
        props.examination.examinationId,
        values,
        props.examination.examinationVersion,
      ),
      { onSuccess: props.onClose },
    );
  }
  const examinationResult = props.examination.result;
  const initialReasonForAbsence =
    isDefined(examinationResult) && examinationResult.type === "absence"
      ? examinationResult.reasonForAbsence
      : "";

  return (
    <FormDialog<ReasonForAbsenceFormValues>
      open
      onClose={props.onClose}
      onSubmit={onSubmit}
      initialValues={{ reasonForAbsence: initialReasonForAbsence }}
      title="Abwesenheit vermerken"
      description="Bitte geben Sie einen Grund für die Abwesenheit ein."
      color="primary"
      confirmLabel="Speichern"
      cancelLabel="Abbrechen"
    >
      <SelectField
        sx={{ paddingTop: 2 }}
        name="reasonForAbsence"
        label="Grund"
        required="Bitte einen Grund angeben."
        options={ABSENCE_OPTIONS}
      />
    </FormDialog>
  );
}

function mapToRequest(
  examinationId: string,
  values: ReasonForAbsenceFormValues,
  version: number,
): UpdateExaminationRequest {
  return {
    examinationId,
    apiUpdateExaminationRequest: {
      version,
      result: {
        type: "AbsenceExaminationResult",
        reasonForAbsence: mapRequiredValue(values.reasonForAbsence),
      },
    },
  };
}
