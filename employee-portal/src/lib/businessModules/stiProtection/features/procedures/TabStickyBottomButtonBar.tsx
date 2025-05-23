/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import { BottomToolbar, ButtonBar } from "@eshg/lib-employee-portal";
import { SubmitButton, useIsFormDisabled } from "@eshg/lib-portal";

import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { useOnCancelForm } from "@/lib/businessModules/stiProtection/shared/helpers";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

interface TabStickyBottomButtonBarProps {
  left?: ReactNode | ReactNode[];
  onCancel?: () => void;
}

export function TabStickyBottomButtonBar({
  left,
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
          left={left}
          right={
            <>
              <Button
                variant="plain"
                disabled={!dirty}
                aria-disabled={isSubmitting || !dirty}
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
