/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentConfirmation } from "@eshg/citizen-portal-api/travelMedicine";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Checkbox } from "@mui/joy";

interface ConfirmationElementProps {
  currentStep: number;
  index: number;
  confirmation: ApiDocumentConfirmation;
  setFieldValue: SetFieldValueHelper;
}

export function ConfirmationElement({
  currentStep,
  index,
  confirmation,
  setFieldValue,
}: Readonly<ConfirmationElementProps>) {
  const name = `sections[${currentStep}].sectionElements[${index}].confirmation.answer`;
  return (
    <Checkbox
      name={name}
      onChange={async (event) => setFieldValue(name, event.target.checked)}
      label={confirmation.confirmationTextField}
      checked={confirmation.answer}
    />
  );
}
