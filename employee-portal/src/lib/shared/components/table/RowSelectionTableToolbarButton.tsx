/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from "@mui/joy";
import { PropsWithChildren, ReactNode } from "react";

interface ProcedureTableTitleButtonProps {
  decorator: ReactNode;
  isPending?: boolean;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
  "data-testid"?: string;
}

export function RowSelectionTableToolbarButton(
  props: PropsWithChildren<ProcedureTableTitleButtonProps>,
) {
  return (
    <Button
      data-testid={props["data-testid"]}
      startDecorator={props.decorator}
      variant="plain"
      color="neutral"
      size="sm"
      sx={{ padding: 0 }}
      loading={props.isPending}
      loadingPosition="start"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}
