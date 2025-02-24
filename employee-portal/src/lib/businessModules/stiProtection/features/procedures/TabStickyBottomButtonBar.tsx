/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BottomToolbar } from "@eshg/lib-employee-portal/components/toolbar/BottomToolbar";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { Button } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";

import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { useOnCancelForm } from "@/lib/businessModules/stiProtection/shared/helpers";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

export interface TabStickyBottomButtonBarProps {
  onCancel?: () => void;
}

export function TabStickyBottomButtonBar({
  onCancel,
}: TabStickyBottomButtonBarProps) {
  const queryClient = useQueryClient();
  const { isSubmitting, dirty, resetForm } = useFormikContext();
  const disabled = useIsFormDisabled();

  const onCancelForm = useOnCancelForm();

  if (disabled) {
    return null;
  }

  return (
    <StickyBottomBox>
      <BottomToolbar sx={{ padding: "0.75rem 1.5rem" }}>
        <ButtonBar
          right={
            <>
              <Button
                variant="plain"
                onClick={() => {
                  onCancelForm({
                    dirty,
                    reset: resetForm,
                    onConfirm() {
                      void queryClient.invalidateQueries({
                        queryKey: stiProtectionApiQueryKey([]),
                      });
                    },
                  });
                  onCancel?.();
                }}
                aria-disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
            </>
          }
        />
      </BottomToolbar>
    </StickyBottomBox>
  );
}
