/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminCertificate } from "@eshg/admin-portal-api/serviceDirectory";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Add, AddModerator } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useCallback, useMemo, useRef } from "react";

import { Actor } from "@/lib/components/view/actors/ActorTable";
import { getCommonName } from "@/lib/helpers/crypto";
import { useTranslation } from "@/lib/i18n/client";

export function EditableCertificateCell(
  props: Readonly<CellContext<Actor, ApiAdminCertificate>>,
): ReactNode {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { error } = useSnackbar();
  const { t } = useTranslation();

  const otherCommonName = useMemo(() => {
    const otherCertificate =
      props.column.id === "currentCertificate"
        ? props.row.original.previousCertificate
        : props.row.original.currentCertificate;
    if (!otherCertificate) {
      return undefined;
    }
    return getCommonName(otherCertificate.value);
  }, [
    props.column.id,
    props.row.original.currentCertificate,
    props.row.original.previousCertificate,
  ]);

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
        if (!commonName || (otherCommonName && commonName != otherCommonName)) {
          error(t("commonNameMismatch"));
          fileInputRef.current!.value = "";
          return;
        }
        props.table.options.meta?.api?.update({
          ...props.row.original,
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
      otherCommonName,
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
        aria-label={t("currentCertificate")}
        onClick={() => fileInputRef.current?.click()}
      >
        {props.getValue() ? <AddModerator size="sm" /> : <Add size="sm" />}
      </IconButton>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept="application/pem-certificate-chain"
        onChange={handleChange}
      />
    </>
  );
}
