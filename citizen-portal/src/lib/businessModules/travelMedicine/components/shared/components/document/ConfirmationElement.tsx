/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { ApiDocumentConfirmation } from "@eshg/travel-medicine-api";
import { Checkbox } from "@mui/joy";

interface ConfirmationElementProps {
  confirmation: ApiDocumentConfirmation;
  parentPath: string;
  name: string;
}

export function ConfirmationElement({
  parentPath,
  confirmation,
  name,
}: Readonly<ConfirmationElementProps>) {
  const { input, helpers } = useBaseField<ApiDocumentConfirmation>({ name });

  const checkBoxPath = `${parentPath}.confirmation.answer`;
  return (
    <Checkbox
      name={checkBoxPath}
      onChange={async (event) => {
        const confirmation = { ...input.value };
        confirmation.answer = !!event.target?.checked;
        await helpers.setValue(confirmation);
        input.onChange(event);
      }}
      label={confirmation.confirmationTextField}
      checked={input.value?.answer ?? false}
      data-testid="document-element-type-confirmation"
    />
  );
}
