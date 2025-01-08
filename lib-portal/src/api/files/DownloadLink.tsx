/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { LinkProps } from "@mui/joy";
import { RefObject } from "react";

import { HiddenContainer } from "../../components/HiddenContainer";
import { ButtonLink } from "../../components/buttons/ButtonLink";

interface DownloadLinkProps
  extends Omit<LinkProps<"button">, "component" | "type" | "onClick"> {
  downloadContainerRef: RefObject<HTMLDivElement>;
  onDownload: () => Promise<unknown>;
}

export function DownloadLink(props: DownloadLinkProps) {
  const { downloadContainerRef, onDownload, ...linkProps } = props;

  return (
    <>
      <ButtonLink {...linkProps} onClick={onDownload} />
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
