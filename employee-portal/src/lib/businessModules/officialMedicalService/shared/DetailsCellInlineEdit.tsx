/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

import {
  DetailsCell,
  DetailsCellProps,
} from "@/lib/shared/components/detailsSection/DetailsCell";

interface DetailsCellInlineEditProps extends DetailsCellProps {
  renderEditButton?: ReactNode;
}
export function DetailsCellInlineEdit(
  props: Readonly<DetailsCellInlineEditProps>,
) {
  return (
    <Stack
      direction="row"
      gap={2}
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
      width={"100%"}
    >
      <DetailsCell name={props.name} label={props.label} value={props.value} />
      {props.renderEditButton}
    </Stack>
  );
}
