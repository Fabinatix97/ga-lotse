/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmpty } from "remeda";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";

import {
  VACCINATION_FIELD_STYLE,
  VaccinationField,
} from "@/lib/businessModules/schoolEntry/features/procedures/vaccination/VaccinationField";

interface OtherVaccinationFormProps extends NestedFormProps {
  description: string;
  count: OptionalFieldValue<number>;
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
