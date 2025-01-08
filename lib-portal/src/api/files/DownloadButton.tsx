/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ButtonProps } from "@mui/joy";
import { RefObject } from "react";

import { HiddenContainer } from "../../components/HiddenContainer";

export interface DownloadButtonProps extends Omit<ButtonProps, "onClick"> {
  downloadContainerRef: RefObject<HTMLDivElement>;
  onDownload: () => Promise<unknown>;
}

export function DownloadButton(props: DownloadButtonProps) {
  const { downloadContainerRef, onDownload, ...buttonProps } = props;

  return (
    <>
      <Button {...buttonProps} onClick={onDownload} />
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
