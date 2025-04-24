/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckboxField } from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal/components/Row";
import {
  BaseField,
  BaseFieldProps,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { validateNonNegativeInteger } from "@/lib/shared/helpers/validators";

export interface PregnancySectionData {
  hasPregnancyRelatedInfo: boolean;
  lastCytologyTest: string;
  startOfLastPeriod: string;
  numberOfPregnancies: number | "";
  numberOfOtherAbortions: number | "";
  numberOfBirths: number | "";
  numberOfInducedAbortions: number | "";
  numberOfEctopicPregnancies: number | "";
}
export function PregnancySection() {
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta("pregnancy.hasPregnancyRelatedInfo");
  return (
    <SectionGrid defaultColumn={1}>
      <Typography level="h3">Schwangerschaftsbezogene Angaben</Typography>
      <CheckboxField
        name="pregnancy.hasPregnancyRelatedInfo"
        label="Schwangerschaftsbezogene Angaben erfassen"
      />
      {value ? <PregnancySectionFields /> : null}
    </SectionGrid>
  );
}

function PregnancySectionFields() {
  const { validatePastOrTodayDate } = useValidators();
  return (
    <>
      <Row gap={3}>
        <DateField
          name="pregnancy.lastCytologyTest"
          label="Letzte Zytologie"
          validate={validatePastOrTodayDate}
        />
        <DateField
          name="pregnancy.startOfLastPeriod"
          label="1. Tag letzte Mensis"
          validate={validatePastOrTodayDate}
        />
      </Row>
      <Row gap={3} sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
        <NumberField
          component={NumberFieldWrapper}
          name="pregnancy.numberOfPregnancies"
          label="Schwangerschaften"
          validate={validateNonNegativeInteger}
        />
        <NumberField
          component={NumberFieldWrapper}
          name="pregnancy.numberOfOtherAbortions"
          label="Aborte"
          validate={validateNonNegativeInteger}
        />
        <NumberField
          component={NumberFieldWrapper}
          name="pregnancy.numberOfBirths"
          label="Geburten"
          validate={validateNonNegativeInteger}
        />
        <NumberField
          component={NumberFieldWrapper}
          name="pregnancy.numberOfInducedAbortions"
          label="Interruption"
          validate={validateNonNegativeInteger}
        />
        <NumberField
          component={NumberFieldWrapper}
          name="pregnancy.numberOfEctopicPregnancies"
          label="EUG"
          validate={validateNonNegativeInteger}
        />
      </Row>
    </>
  );
}

function NumberFieldWrapper({ children, ...props }: BaseFieldProps) {
  return (
    <BaseField sx={{ flex: 1, minWidth: 150 }} {...props}>
      {children}
    </BaseField>
  );
}
