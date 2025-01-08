/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal/components/Row";
import {
  BaseField,
  BaseFieldProps,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

export interface PregnancySectionData {
  hasPregnancyRelatedInfo: boolean;
  lastCytologyTest: Date | null;
  startOfLastPeriod: Date | null;
  numberOfPregnancies: number | "";
  numberOfOtherAbortions: number | "";
  numberOfBirths: number | "";
  numberOfInducedAbortions: number | "";
  numberOfEctopicPregnancies: number | "";
}
export function PregnancySection() {
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta("hasPregnancyRelatedInfo");
  return (
    <SectionGrid defaultColumn={1}>
      <Typography level="h3">Schwangerschaftsbezogene Angaben</Typography>
      <CheckboxField
        name="hasPregnancyRelatedInfo"
        label="Schwangerschaftsbezogene Angaben erfassen"
      />
      {value ? <PregnancySectionFields /> : null}
    </SectionGrid>
  );
}

function PregnancySectionFields() {
  return (
    <>
      <Row gap={3}>
        <DateField name="lastCytologyTest" label="Letzte Zytologie" />
        <DateField name="startOfLastPeriod" label="1. Tag letzte Mensis" />
      </Row>
      <Row gap={3} sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
        <NumberField
          component={NumberFieldWrapper}
          name="numberOfPregnancies"
          label="Schwangerschaften"
        />
        <NumberField
          component={NumberFieldWrapper}
          name="numberOfOtherAbortions"
          label="Aborte"
        />
        <NumberField
          component={NumberFieldWrapper}
          name="numberOfBirths"
          label="Geburten"
        />
        <NumberField
          component={NumberFieldWrapper}
          name="numberOfInducedAbortions"
          label="Interruption"
        />
        <NumberField
          component={NumberFieldWrapper}
          name="numberOfEctopicPregnancies"
          label="EUG"
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
