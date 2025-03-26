/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormButtonBar } from "@eshg/lib-employee-portal";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { Divider } from "@mui/joy";

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
