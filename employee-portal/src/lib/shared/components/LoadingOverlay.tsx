/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LoadingIndicator,
  LoadingIndicatorProps,
} from "@eshg/lib-portal/components/LoadingIndicator";
import { Modal } from "@mui/joy";

type LoadingOverlayProps = Pick<LoadingIndicatorProps, "text">;

export function LoadingOverlay(props: LoadingOverlayProps) {
  return (
    <Modal open disablePortal hideBackdrop>
      <LoadingIndicator fullHeight {...props} />
    </Modal>
  );
}
