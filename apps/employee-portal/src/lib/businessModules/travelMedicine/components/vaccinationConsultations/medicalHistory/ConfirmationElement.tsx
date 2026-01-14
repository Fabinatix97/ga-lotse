/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SetStateAction } from "react";

import { CheckboxField } from "@eshg/lib-portal";
import { ApiDocumentConfirmation } from "@eshg/travel-medicine-api";

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
      disabled={readOnly}
      data-testid="document-element-type-confirmation"
      onChange={(event) => setFieldValue(name, event.target.checked)}
    />
  );
}
