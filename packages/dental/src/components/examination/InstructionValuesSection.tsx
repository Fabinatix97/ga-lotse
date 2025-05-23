/**
 * Copyright 2025 cronn GmbH
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
      +values.inspectionAppointment
    );
  }

  return (
    <ExaminationSection title={`Anweisungen (${countChecked()})`}>
      <Stack gap={2}>
        <Checkbox
          name="treatmentPrimaryDentition"
          label="zur Behandlung im Milchgebiss"
          checked={treatmentPrimaryDentition}
          disabled
        />
        <Checkbox
          name="treatmentSecondaryDentition"
          label="zur Beh., kar. Zähne im Bleib. Gebiss"
          checked={treatmentSecondaryDentition}
          disabled
        />
        <CheckboxField
          name="individualProphylaxis"
          label="zur Individualprophylaxe"
        />
        <CheckboxField name="fissureSealing" label="zur Fissurenversiegelung" />
        <CheckboxField name="tartarRemoval" label="Zahnsteinentfernung" />
        <CheckboxField
          name="gingivitisTreatment"
          label="Zahnfleischentzündung"
        />
        <CheckboxField
          name="orthodonticTreatment"
          label="zur kieferorthopädischen Beratung"
        />
        <CheckboxField name="plaqueTreatment" label="Plaque" />
        <CheckboxField name="inspectionAppointment" label="Kontrolltermin" />
      </Stack>
    </ExaminationSection>
  );
}
