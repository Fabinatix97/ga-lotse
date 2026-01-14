/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Radio } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDeepEqual } from "remeda";

import { RadioGroupField } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

import { SchoolInfoLetterField, schoolInfoLetterForm } from "./FieldComponents";
import { SchoolInfoLetterFormSection } from "./SchoolInfoLetterFormSection";

export function LetterFieldHorizontalRadioGroup(
  props: {
    differentValues: string;
    options: { value: string; label: string }[];
  } & Omit<SchoolInfoLetterField, "label">,
) {
  const { values } = useFormikContext<SchoolInfoLetter>();

  return (
    <SchoolInfoLetterFormSection
      isChanged={!isDeepEqual(props.defaultValue, values[props.field])}
      differentValues={props.differentValues}
      subtitle={props.subtitle}
      type="radio"
    >
      <RadioGroupField
        name={schoolInfoLetterForm(props.field)}
        orientation="horizontal"
        sx={{
          ".MuiRadioGroup-root": {
            "--RadioGroup-gap": { md: "1rem", xxs: 0 },
            gap: { md: 0, xxs: 2 },
            flexDirection: { md: "row", xxs: "column" },
          },
        }}
      >
        {props.options.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroupField>
    </SchoolInfoLetterFormSection>
  );
}
