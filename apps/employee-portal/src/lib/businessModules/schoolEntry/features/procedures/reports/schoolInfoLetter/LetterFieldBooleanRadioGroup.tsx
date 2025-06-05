/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Radio } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDeepEqual } from "remeda";

import { RadioGroupField } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

import { SchoolInfoLetterField, schoolInfoLetterForm } from "./FieldComponents";
import { SchoolInfoLetterFormSection } from "./SchoolInfoLetterFormSection";
import { booleanValue } from "./mappings";

export function LetterFieldBooleanRadioGroup(
  props: { defaultValue: "yes" | "no" } & Omit<SchoolInfoLetterField, "label">,
) {
  const { values } = useFormikContext<SchoolInfoLetter>();

  return (
    <SchoolInfoLetterFormSection
      isChanged={!isDeepEqual(props.defaultValue, values[props.field])}
      differentValues={booleanValue(props.defaultValue)}
      subtitle={props.subtitle}
      type="radio"
    >
      <RadioGroupField
        orientation="horizontal"
        name={schoolInfoLetterForm(props.field)}
        sx={{
          ".MuiRadioGroup-root": {
            "--RadioGroup-gap": "2.5rem",
          },
        }}
      >
        <Radio value="no" label="nein" />
        <Radio value="yes" label="ja" />
      </RadioGroupField>
    </SchoolInfoLetterFormSection>
  );
}
