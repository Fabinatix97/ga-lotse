/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyish } from "remeda";

import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonFormProps,
} from "@eshg/lib-employee-portal";

import { PersonFormWithoutBirthDetails } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/PersonFormWithoutBirthDetails";

export function CustodianForm(props: PersonFormProps<DefaultPersonFormValues>) {
  if (isEmptyish(props.values.dateOfBirth)) {
    return <PersonFormWithoutBirthDetails {...props} />;
  } else {
    return <DefaultPersonForm {...props} />;
  }
}
