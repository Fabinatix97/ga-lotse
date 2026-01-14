/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AspectRatio,
  AspectRatioProps,
  CircularProgress,
  styled,
} from "@mui/joy";
import { PropsWithChildren } from "react";

interface LoadingSheetProps extends PropsWithChildren<AspectRatioProps> {
  title: string;
}

export function LoadingSheet({
  title,
  ...aspectRatioProps
}: LoadingSheetProps) {
  return (
    <AspectRatio {...aspectRatioProps}>
      <Backdrop>
        <CircularProgress aria-label={title} />
      </Backdrop>
    </AspectRatio>
  );
}

const Backdrop = styled("div")(({ theme }) => ({
  background: theme.palette.background.backdrop,
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  userSelect: "none",
  borderRadius: "12px",
  zIndex: theme.zIndex.table,
}));
