/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider } from "@mui/joy";

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { FormButtonBar } from "./FormButtonBar";

interface FormFooterProps {
  isSubmitting: boolean;
}

export function FormFooter({ isSubmitting }: FormFooterProps) {
  const disabled = useIsFormDisabled();
  if (disabled) {
    return null;
  }

  return (
    <>
      <Divider />
      <FormButtonBar submitLabel="Speichern" submitting={isSubmitting} />
    </>
  );
}
