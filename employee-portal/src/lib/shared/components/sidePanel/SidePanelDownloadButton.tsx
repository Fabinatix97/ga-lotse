/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  DownloadButton,
  DownloadButtonProps,
} from "@eshg/lib-portal/api/files/DownloadButton";

type SidePanelDownloadButtonProps = Omit<
  DownloadButtonProps,
  "variant" | "color" | "sx"
>;

export function SidePanelDownloadButton(props: SidePanelDownloadButtonProps) {
  return (
    <DownloadButton
      {...props}
      variant="soft"
      color="neutral"
      sx={{
        justifyContent: "flex-start",
      }}
    />
  );
}
