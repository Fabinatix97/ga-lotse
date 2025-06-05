/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { isEmpty } from "remeda";

import { CheckboxGroupField, buildEnumOptions } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

import { SchoolInfoLetterField, schoolInfoLetterForm } from "./FieldComponents";
import { SchoolInfoLetterFormSection } from "./SchoolInfoLetterFormSection";
import { isFieldDirty } from "./mappings";

export function LetterFieldCheckboxGroupField(
  props: {
    mapToReadableName: Record<string, string>;
    orientation?: "vertical" | "horizontal";
    threeColumnStyling?: boolean;
  } & Omit<SchoolInfoLetterField, "label">,
) {
  const { values } = useFormikContext<SchoolInfoLetter>();

  function getCheckboxGroupsValueDifference(): string {
    const defaultList = props.defaultValue as string[];
    if (isEmpty(defaultList)) {
      return "deaktiviert";
    }
    return defaultList
      .map((checkboxValue) => props.mapToReadableName[checkboxValue])
      .join(", ");
  }

  return (
    <SchoolInfoLetterFormSection
      isChanged={isFieldDirty(props.defaultValue, values[props.field])}
      differentValues={getCheckboxGroupsValueDifference()}
      subtitle={props.subtitle}
      type="checkboxGroup"
    >
      <CheckboxGroupField
        name={schoolInfoLetterForm(props.field)}
        options={buildEnumOptions(props.mapToReadableName)}
        sxCheckboxes={
          props.threeColumnStyling
            ? {
                display: "grid",
                gridTemplateColumns: { md: "auto auto auto" },
              }
            : {}
        }
        orientation={props.orientation}
      />
    </SchoolInfoLetterFormSection>
  );
}
