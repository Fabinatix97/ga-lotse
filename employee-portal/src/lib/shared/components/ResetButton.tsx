/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/joy";

export function ResetButton(props: { onReset: () => void }) {
  return (
    <IconButton
      variant="plain"
      color="neutral"
      aria-label="Zurücksetzen"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={props.onReset}
    >
      <CloseRoundedIcon />
    </IconButton>
  );
}
