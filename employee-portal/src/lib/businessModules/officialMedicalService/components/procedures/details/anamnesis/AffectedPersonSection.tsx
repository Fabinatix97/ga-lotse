/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { YearField } from "@eshg/lib-portal/components/formFields/YearField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";

import { AnamnesisFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm.config";
import { SectionSheet } from "@/lib/businessModules/officialMedicalService/shared/SectionSheet";
import {
  FILLING_PERSON_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/lib/businessModules/officialMedicalService/shared/options";
import { RadioButtonsField } from "@/lib/shared/components/formFields/RadioButtonsField";

export function AffectedPersonSection() {
  const affectedPersonInfo = createFieldNameMapper("affectedPersonInfo");
  const { values, setFieldValue } = useFormikContext<AnamnesisFormValues>();

  function handleNumberOfChildrenChange(newValue: OptionalFieldValue<number>) {
    const birthYearsCount =
      values.affectedPersonInfo?.yearsOfBirthOfChildren.length;
    if (newValue !== "" && newValue < birthYearsCount) {
      for (let i = newValue; i < birthYearsCount; i++) {
        void setFieldValue(
          affectedPersonInfo(`yearsOfBirthOfChildren.${i}`),
          undefined,
        );
      }
    }
  }

  return (
    <MemoizedAffectedPersonSection
      numberOfChildren={values.affectedPersonInfo.numberOfChildren}
      onNumberOfChildrenChange={(newValue) =>
        handleNumberOfChildrenChange(newValue)
      }
    />
  );
}

const MemoizedAffectedPersonSection = memo(InnerAffectedPersonSection);

interface InnerAffectedPersonSectionProps {
  numberOfChildren: OptionalFieldValue<number>;
  onNumberOfChildrenChange: (newValue: OptionalFieldValue<number>) => void;
}
function InnerAffectedPersonSection(props: InnerAffectedPersonSectionProps) {
  const affectedPersonInfo = createFieldNameMapper("affectedPersonInfo");

  return (
    <SectionSheet
      title="Angaben zur Person"
      slotProps={{ stack: { sx: { width: 2 / 3 } } }}
    >
      <RadioButtonsField
        options={FILLING_PERSON_OPTIONS}
        name={affectedPersonInfo("fillingPerson")}
        label="Angaben zur ausfüllenden Person"
        orientation="vertical"
        required="Pflichtfeld ausfüllen"
      />
      <SelectField
        options={MARITAL_STATUS_OPTIONS}
        name={affectedPersonInfo("maritalStatus")}
        label="Familienstand"
        placeholder="Auswählen"
        required="Pflichtfeld ausfüllen"
      ></SelectField>
      <Stack gap={3} direction="row" useFlexGap sx={{ flexWrap: "wrap" }}>
        <NumberField
          name={affectedPersonInfo("numberOfChildren")}
          label="Anzahl Kinder"
          min={0}
          onChange={(newValue) => props.onNumberOfChildrenChange(newValue)}
          required="Pflichtfeld ausfüllen"
        ></NumberField>
        {!isEmptyString(props.numberOfChildren) &&
          Array.from(Array(props.numberOfChildren).keys()).map((index) => (
            <YearField
              name={affectedPersonInfo(`yearsOfBirthOfChildren.${index}`)}
              label={`Geburtsjahr Kind ${index + 1}`}
              key={index}
              min={1900}
              max={new Date().getFullYear()}
            />
          ))}
      </Stack>
      <InputField
        name={affectedPersonInfo("occupation")}
        label="Beruf"
      ></InputField>
    </SectionSheet>
  );
}
