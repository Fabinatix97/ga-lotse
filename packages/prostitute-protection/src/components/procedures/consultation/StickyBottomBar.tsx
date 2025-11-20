/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button } from "@mui/joy";
import { ReactNode } from "react";

import { BottomToolbar, ButtonBar } from "@eshg/lib-employee-portal";
import { SubmitButton, useIsFormDisabled } from "@eshg/lib-portal";

interface StickyBottomBarProps {
  left?: ReactNode | ReactNode[];
  onCancel?: () => void;
}

export function StickyBottomBar({ left, onCancel }: StickyBottomBarProps) {
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
                onClick={() => {
                  onCancel?.();
                }}
              >
                Abbrechen
              </Button>
              <SubmitButton submitting={false}>Speichern</SubmitButton>
            </>
          }
        />
      </BottomToolbar>
    </Box>
  );
}
