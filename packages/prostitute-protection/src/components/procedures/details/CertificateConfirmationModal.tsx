/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Checkbox, Typography } from "@mui/joy";
import { WithRequired } from "@tanstack/react-query";
import { useState } from "react";

import {
  BaseConfirmationDialog,
  ConfirmationDialogProps,
} from "@eshg/lib-portal";
import { ApiCreateCertificateRequest } from "@eshg/prostitute-protection-api";

type BaseConfirmationDialogProps = {
  onConfirm: ({
    withAlias,
    withRegistrationCertificate,
    dateOfBirth,
    firstName,
    lastName,
  }: ApiCreateCertificateRequest) => Promise<void> | void;
} & Omit<WithRequired<ConfirmationDialogProps, "title">, "onConfirm">;

export function CertificateConfirmationModal({
  onConfirm,
  ...props
}: BaseConfirmationDialogProps) {
  const [withAlias, setWithAlias] = useState(false);
  const [withRegistrationCertificate, setWithRegistrationCertificate] =
    useState(false);

  function onClose() {
    props.onClose();
    setWithAlias(false);
    setWithRegistrationCertificate(false);
  }

  return (
    <BaseConfirmationDialog
      {...props}
      hideDescription
      description=""
      confirmLabel="Zertifikat erstellen PDF"
      cancelLabel="Abbrechen"
      onConfirm={() =>
        onConfirm({
          withAlias,
          withRegistrationCertificate,
          // TODO replace placeholders with actual values from local storage
          dateOfBirth: new Date(),
          firstName: "",
          lastName: "",
        })
      }
      onClose={onClose}
    >
      <Box>
        <Typography mb={2}>
          Das Zertifikat enthält standardmäßig den offiziellen Namen der
          beratenen Person. Optional kann stattdessen ein Alias verwendet
          werden. Zusätzlich kann ein Zertifikat nach §7 erstellt werden.
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Checkbox
            checked={withAlias}
            label="Verwendung des Alias"
            onChange={(e) => setWithAlias(e.target.checked)}
          />
          <Checkbox
            checked={withRegistrationCertificate}
            label="Gleichzeitige Erstellung des Registrierungs Zertifikat nach §7"
            onChange={(e) => setWithRegistrationCertificate(e.target.checked)}
          />
        </Box>
      </Box>
    </BaseConfirmationDialog>
  );
}
