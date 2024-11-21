/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { Typography } from "@mui/joy";

export type DownloadNotPossibleDialogProps = Omit<
  BaseModalProps,
  "children" | "modalTitle"
>;

export function DownloadNotPossibleDialog(
  props: DownloadNotPossibleDialogProps,
) {
  return (
    <BaseModal {...props}>
      <Typography level="h3" color="danger">
        Download nicht möglich
      </Typography>
      <Typography level="body-md">
        Keiner der ausgewählten Vorgänge hat einen zugewiesenen Termin. Daher
        sind keine Einladungen vorhanden.
      </Typography>
    </BaseModal>
  );
}
