/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentConfirmation } from "@eshg/employee-portal-api/travelMedicine";
import { SetStateAction } from "react";

import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

interface ConfirmationElementProps {
  sectionIndex: number;
  elementIndex: number;
  confirmation: ApiDocumentConfirmation;
  readOnly: boolean;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: SetStateAction<any>) => void;
}

export function ConfirmationElement({
  sectionIndex,
  elementIndex,
  confirmation,
  readOnly,
  setFieldValue,
}: Readonly<ConfirmationElementProps>) {
  const name = `medicalHistoryContent.sections[${sectionIndex}].sectionElements[${elementIndex}].confirmation.answer`;

  return (
    <CheckboxField
      label={confirmation.confirmationTextField}
      name={name}
      onChange={(event) => setFieldValue(name, event.target.checked)}
      disabled={readOnly}
      data-testid="document-element-type-confirmation"
    />
  );
}
