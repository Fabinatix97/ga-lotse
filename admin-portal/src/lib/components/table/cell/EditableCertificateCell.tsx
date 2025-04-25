/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, AddModerator } from "@mui/icons-material";
import { IconButton, styled } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useCallback, useRef } from "react";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiAdminCertificate } from "@eshg/service-directory-api";

import { Actor } from "@/lib/components/view/actors/ActorTable";
import { getCommonName } from "@/lib/helpers/crypto";
import { useTranslation } from "@/lib/i18n/client";

const HiddenInput = styled("input")({ display: "hidden" });

export function EditableCertificateCell(
  props: Readonly<CellContext<Actor, ApiAdminCertificate>>,
): ReactNode {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { error } = useSnackbar();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const fr = new FileReader();
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      fr.onload = () => {
        let commonName;
        try {
          commonName = getCommonName(fr.result as string);
        } catch {
          error(t("pemParseError"));
          fileInputRef.current!.value = "";
          return;
        }
        if (!commonName) {
          error(t("commonNameMismatch"));
          fileInputRef.current!.value = "";
          return;
        }
        props.table.options.meta?.api?.update({
          id: props.row.original.id,
          commonName,
          [props.column.id]: {
            signature: "",
            signatory: "",
            value: fr.result,
          },
        });
      };
      fr.readAsText(new Blob([file]));
    },
    [
      error,
      props.column.id,
      props.row.original,
      props.table.options.meta?.api,
      t,
    ],
  );

  return (
    <>
      <IconButton
        sx={{ display: "inline", minHeight: "24px", minWidth: "24px" }}
        size="sm"
        aria-label={t("certificate")}
        onClick={() => fileInputRef.current?.click()}
      >
        {props.getValue() ? <AddModerator size="sm" /> : <Add size="sm" />}
      </IconButton>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="application/pem-certificate-chain"
        onChange={handleChange}
      />
    </>
  );
}
