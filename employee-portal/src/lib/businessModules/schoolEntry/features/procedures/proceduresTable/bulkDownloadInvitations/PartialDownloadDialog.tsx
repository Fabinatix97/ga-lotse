/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { Button, Stack, Typography } from "@mui/joy";

export interface PartialDownloadDialogProps
  extends Omit<BaseModalProps, "children" | "modalTitle"> {
  total: number;
  invitationsToDownload: number;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

export function PartialDownloadDialog(props: PartialDownloadDialogProps) {
  const remainingProceduresText =
    props.invitationsToDownload === 1
      ? "den übrigen 1 Vorgang"
      : `die übrigen ${props.invitationsToDownload} Vorgänge`;
  const downloadButtonText =
    props.invitationsToDownload === 1
      ? "1 Einladung herunterladen"
      : `${props.invitationsToDownload} Einladungen herunterladen`;
  return (
    <BaseModal modalTitle="Download starten?" color="primary" {...props}>
      <Typography level="body-md">
        {props.total - props.invitationsToDownload} von {props.total}{" "}
        ausgewählten Vorgängen haben keinen festgelegten Termin. Einladungen
        können nur für {remainingProceduresText} heruntergeladen werden. Möchten
        Sie diese Einladungen herunterladen?
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button variant="outlined" color="neutral" onClick={props.onClose}>
          Abbrechen
        </Button>
        <Button
          color="primary"
          onClick={props.onConfirm}
          loading={props.isPending}
          loadingPosition="start"
          disabled={props.isPending}
        >
          {downloadButtonText}
        </Button>
      </Stack>
    </BaseModal>
  );
}
