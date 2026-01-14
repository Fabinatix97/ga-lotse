/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmpty } from "remeda";

import {
  InputField,
  NestedFormProps,
  OptionalFieldValue,
  createFieldNameMapper,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";

import {
  VACCINATION_FIELD_STYLE,
  VaccinationField,
} from "@/lib/businessModules/schoolEntry/features/procedures/vaccination/VaccinationField";

interface OtherVaccinationFormProps extends NestedFormProps {
  description: string;
  count: OptionalFieldValue<number>;
  ref?: (el: HTMLInputElement) => void;
}
export function OtherVaccinationForm(props: OtherVaccinationFormProps) {
  const fieldName = createFieldNameMapper(props.name);

  function getRequiredCount() {
    if (!isEmpty(props.description)) {
      return "Bitte die Anzahl der Impfungen angeben.";
    }
  }

  function getRequiredDescription() {
    if (props.count !== "") {
      return "Bitte den Namen der Impfung angeben.";
    }
  }

  return (
    <>
      <InputField
        ref={props.ref}
        name={fieldName("description")}
        label="Sonstige"
        type="text"
        sx={VACCINATION_FIELD_STYLE}
        required={getRequiredDescription()}
      />
      <VaccinationField
        name={fieldName("count")}
        label="Anzahl Impfungen"
        required={getRequiredCount()}
        validate={validateIntegerAnd(validateRange(1, 8))}
        min={1}
        max={8}
      />
    </>
  );
}
