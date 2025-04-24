/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { BottomToolbar, FormButtonBar } from "@eshg/lib-employee-portal";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useFormikContext } from "formik";

import { useOnCancelForm } from "@/lib/businessModules/stiProtection/shared/helpers";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

export function AnamnesisButtonBar() {
  const { isSubmitting, dirty, resetForm } = useFormikContext();
  const disabled = useIsFormDisabled();
  const onCancelForm = useOnCancelForm();

  if (disabled) {
    return null;
  }

  return (
    <StickyBottomBox>
      <BottomToolbar sx={{ padding: "0.75rem 1.5rem" }}>
        <FormButtonBar
          submitLabel="Speichern"
          cancelLabel="Verwerfen"
          submitting={isSubmitting}
          onCancel={
            dirty
              ? () => {
                  onCancelForm({
                    dirty,
                    reset: resetForm,
                  });
                }
              : undefined
          }
        />
      </BottomToolbar>
    </StickyBottomBox>
  );
}
