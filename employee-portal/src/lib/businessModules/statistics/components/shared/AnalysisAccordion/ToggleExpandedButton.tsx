/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UnfoldLessOutlined, UnfoldMoreOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

export interface ToggleExpandedButtonProps {
  someExpanded: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function ToggleExpandedButton(props: ToggleExpandedButtonProps) {
  return props.someExpanded ? (
    <Button
      variant="plain"
      startDecorator={<UnfoldLessOutlined />}
      onClick={props.onCollapseAll}
    >
      Alle einklappen
    </Button>
  ) : (
    <Button
      variant="plain"
      startDecorator={<UnfoldMoreOutlined />}
      onClick={props.onExpandAll}
    >
      Alle ausklappen
    </Button>
  );
}
