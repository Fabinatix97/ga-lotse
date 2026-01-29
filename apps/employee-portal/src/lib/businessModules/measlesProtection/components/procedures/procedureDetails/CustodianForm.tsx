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

import { CustodianFormWithoutBirthDetails } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CustodianFormWithoutBirthDetails";

export function CustodianForm(props: PersonFormProps<DefaultPersonFormValues>) {
  if (isEmptyish(props.values.dateOfBirth)) {
    return <CustodianFormWithoutBirthDetails {...props} />;
  } else {
    return <DefaultPersonForm {...props} />;
  }
}
