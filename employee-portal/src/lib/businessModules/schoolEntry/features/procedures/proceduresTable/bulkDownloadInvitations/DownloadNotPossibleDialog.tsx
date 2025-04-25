/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { OverlayBoundary } from "@eshg/lib-employee-portal";
import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";

export type DownloadNotPossibleDialogProps = Omit<
  BaseModalProps,
  "children" | "modalTitle"
>;

export function DownloadNotPossibleDialog(
  props: DownloadNotPossibleDialogProps,
) {
  return (
    <OverlayBoundary>
      <BaseModal modalTitle="Download nicht möglich" color="danger" {...props}>
        <Typography level="body-md">
          Keiner der ausgewählten Vorgänge hat einen zugewiesenen Termin. Daher
          sind keine Einladungen vorhanden.
        </Typography>
      </BaseModal>
    </OverlayBoundary>
  );
}
