/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import {
  BottomToolbar,
  ButtonBar,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { SubmitButton, useIsFormDisabled } from "@eshg/lib-portal";

import { proceduresQueryKey } from "../../../api/queries/apiQueryKeys";

interface StickyBottomBarProps {
  left?: ReactNode | ReactNode[];
  onCancel?: () => void;
}

export function StickyBottomBar({ left, onCancel }: StickyBottomBarProps) {
  const queryClient = useQueryClient();
  const { isSubmitting, dirty, resetForm } = useFormikContext();
  const { openCancelDialog } = useConfirmationDialog();
  const disabled = useIsFormDisabled();

  if (disabled) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        marginInline: (theme) => theme.spacing(-3),
        marginBlockEnd: (theme) => theme.spacing(-3),
        zIndex: (theme) => theme.zIndex.toolbar,
      }}
    >
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
                  openCancelDialog({
                    onConfirm() {
                      resetForm();
                      void queryClient.invalidateQueries({
                        queryKey: proceduresQueryKey([]),
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
    </Box>
  );
}
