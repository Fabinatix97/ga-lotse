/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { Alert, isAdult } from "@eshg/lib-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";

interface UnderagedPersonAlertProps {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}

export function UnderagedPersonAlert({ procedure }: UnderagedPersonAlertProps) {
  if (
    !procedure.isOpen ||
    isAdult(procedure.affectedPerson.dateOfBirth) ||
    !isDefined(procedure.custodians) ||
    procedure.custodians.length === 0 ||
    isDefined(
      procedure.custodians.find((custodian) => isAdult(custodian.dateOfBirth)),
    )
  ) {
    return null;
  }
  return (
    <Alert
      color="warning"
      title="Personensorgeberechtigte:r minderjährig"
      message="Die betroffene Person ist minderjährig. Geben Sie eine volljährige PSB an."
    />
  );
}
