/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { isDeepEqual } from "remeda";

import { TextareaField } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

import { SchoolInfoLetterField, schoolInfoLetterForm } from "./FieldComponents";
import { SchoolInfoLetterFormSection } from "./SchoolInfoLetterFormSection";

export function LetterFieldTextarea(
  props: { minRows?: number } & SchoolInfoLetterField,
) {
  const { values } = useFormikContext<SchoolInfoLetter>();

  return (
    <SchoolInfoLetterFormSection
      isChanged={!isDeepEqual(props.defaultValue, values[props.field])}
      differentValues=""
      type="text"
    >
      <TextareaField
        name={schoolInfoLetterForm(props.field)}
        label={props.label}
        minRows={props.minRows}
      />
    </SchoolInfoLetterFormSection>
  );
}
