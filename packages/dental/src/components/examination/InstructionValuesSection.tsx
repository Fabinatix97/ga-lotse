/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import { CheckboxField } from "@eshg/lib-portal";

import { ScreeningExaminationResult } from "../../api/models/ExaminationResult";
import { calculateTreatmentRequiredValuesByDentitionType } from "../../features/prophylaxisSessions/utils/treatmentRequiredValues";
import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";

import { ExaminationSection } from "./ExaminationSection";

export function InstructionValuesSection() {
  const dentition = useExaminationStore((store) => store.dentition);

  const { values } = useFormikContext<ScreeningExaminationResult>();

  const treatmentRequiredValues =
    calculateTreatmentRequiredValuesByDentitionType(dentition);
  const treatmentPrimaryDentition = treatmentRequiredValues.primaryTeeth;
  const treatmentSecondaryDentition = treatmentRequiredValues.secondaryTeeth;

  function countChecked() {
    return (
      +treatmentPrimaryDentition +
      +treatmentSecondaryDentition +
      +values.individualProphylaxis +
      +values.fissureSealing +
      +values.tartarRemoval +
      +values.gingivitisTreatment +
      +values.orthodonticTreatment +
      +values.plaqueTreatment +
      +values.inspectionAppointment +
      +values.primaryDentitionObstructsSecondary
    );
  }

  return (
    <ExaminationSection title={`Anweisungen (${countChecked()})`}>
      <Stack gap={2}>
        <Checkbox
          name="treatmentPrimaryDentition"
          label="Zur Behandlung im Milchgebiss"
          checked={treatmentPrimaryDentition}
          disabled
        />
        <Checkbox
          name="treatmentSecondaryDentition"
          label="Zur Beh. kariöser Zähne im bleibenden Gebiss"
          checked={treatmentSecondaryDentition}
          disabled
        />
        <CheckboxField
          name="individualProphylaxis"
          label="Zur Individualprophylaxe"
        />
        <CheckboxField name="fissureSealing" label="Zur Fissurenversiegelung" />
        <CheckboxField
          name="orthodonticTreatment"
          label="Zur kieferorthopädischen Beratung"
        />
        <CheckboxField name="plaqueTreatment" label="Plaque" />
        <CheckboxField name="tartarRemoval" label="Zahnsteinentfernung" />
        <CheckboxField
          name="gingivitisTreatment"
          label="Zahnfleischentzündung"
        />
        <CheckboxField
          name="primaryDentitionObstructsSecondary"
          label="Milchzahn macht dem neuen Zahn keinen Platz"
        />
        <CheckboxField name="inspectionAppointment" label="Kontrolltermin" />
      </Stack>
    </ExaminationSection>
  );
}
