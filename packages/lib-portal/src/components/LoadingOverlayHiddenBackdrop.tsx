/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Modal } from "@mui/joy";

import { LoadingIndicator, LoadingIndicatorProps } from "./LoadingIndicator";

type LoadingOverlayHiddenBackdropProps = Pick<LoadingIndicatorProps, "text">;

export function LoadingOverlayHiddenBackdrop(
  props: LoadingOverlayHiddenBackdropProps,
) {
  return (
    <Modal open disablePortal hideBackdrop>
      <LoadingIndicator fullHeight {...props} />
    </Modal>
  );
}
