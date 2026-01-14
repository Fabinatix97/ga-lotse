/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiReasonForAbsence } from "@eshg/dental-api";
import { FormDialog } from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  SelectField,
  buildEnumOptions,
  mapRequiredValue,
} from "@eshg/lib-portal";

import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";

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
  open?: boolean;
  onSubmit: (reasonForAbsence: ApiReasonForAbsence) => void;
  onCancel: () => void;
  examination: ProphylaxisSessionExamination;
}

export function ChangeReasonForAbsenceModal(
  props: ChangeReasonForAbsenceModalProps,
) {
  const examinationResult = props.examination.result;
  const initialReasonForAbsence =
    isDefined(examinationResult) && examinationResult.type === "absence"
      ? examinationResult.reasonForAbsence
      : "";

  function onSubmit(values: ReasonForAbsenceFormValues) {
    props.onSubmit(mapRequiredValue(values.reasonForAbsence));
  }

  return (
    <FormDialog<ReasonForAbsenceFormValues>
      open={props.open ?? false}
      initialValues={{ reasonForAbsence: initialReasonForAbsence }}
      title="Abwesenheit vermerken"
      description="Bitte geben Sie einen Grund für die Abwesenheit ein."
      color="primary"
      confirmLabel="Speichern"
      cancelLabel="Abbrechen"
      onClose={props.onCancel}
      onSubmit={onSubmit}
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
