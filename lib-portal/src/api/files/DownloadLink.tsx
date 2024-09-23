/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line no-restricted-imports
import { Link, LinkProps } from "@mui/joy";
import { RefObject } from "react";

import { HiddenContainer } from "../../components/HiddenContainer";

interface DownloadLinkProps
  extends Omit<LinkProps<"button">, "component" | "type" | "onClick"> {
  downloadContainerRef: RefObject<HTMLDivElement>;
  onDownload: () => Promise<unknown>;
}

export function DownloadLink(props: DownloadLinkProps) {
  const { downloadContainerRef, onDownload, ...linkProps } = props;

  return (
    <>
      <Link
        {...linkProps}
        component="button"
        type="button"
        onClick={onDownload}
      />
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
