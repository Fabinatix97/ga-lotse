/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EmailField,
  InputArrayField,
  PERSON_FIELD_NAME,
  createFieldNameMapper,
  getIndexLabel,
  useValidateLength,
} from "@eshg/lib-portal";

import { DefaultPersonFormValues } from "./DefaultPersonForm";

export function ContactInfoFormSection() {
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper<DefaultPersonFormValues>();

  return (
    <>
      <div role="group" aria-label="E-Mail-Adressen">
        <InputArrayField
          name={fieldName("emailAddresses")}
          addMoreLabel="E-Mail-Adresse hinzufügen"
          fieldComponent={EmailField}
          label={(index) =>
            getIndexLabel(PERSON_FIELD_NAME.emailAddresses, index)
          }
          validateEach={validateLength(6, 254)}
        />
      </div>

      <div role="group" aria-label="Telefonnummern">
        <InputArrayField
          name={fieldName("phoneNumbers")}
          addMoreLabel="Telefonnummer hinzufügen"
          label={(index) =>
            getIndexLabel(PERSON_FIELD_NAME.phoneNumbers, index)
          }
          validateEach={validateLength(1, 23)}
        />
      </div>
    </>
  );
}
