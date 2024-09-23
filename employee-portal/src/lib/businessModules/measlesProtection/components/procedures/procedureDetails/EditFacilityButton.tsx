/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EditOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/joy";

import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export function EditFacilityButton({
  label,
  disabled,
}: {
  readonly label: string;
  readonly disabled: boolean;
}) {
  const [_open, setOpen] = useSearchParam("edit-facility", "boolean");

  return (
    <IconButton
      color="primary"
      onClick={() => setOpen(true)}
      aria-label={label}
      disabled={disabled}
    >
      <EditOutlined />
    </IconButton>
  );
}
