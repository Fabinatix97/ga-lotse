/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

import {
  DetailsItem,
  DetailsItemProps,
} from "@/lib/shared/components/detailsSection/items/DetailsItem";

interface DetailsItemInlineEditProps<TLabelProps, TValueProps>
  extends DetailsItemProps<TLabelProps, TValueProps> {
  renderEditButton?: ReactNode;
}
export function DetailsItemInlineEdit<TLabelProps, TValueProps>(
  props: Readonly<DetailsItemInlineEditProps<TLabelProps, TValueProps>>,
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
      <DetailsItem label={props.label} value={props.value} />
      {props.renderEditButton}
    </Stack>
  );
}
