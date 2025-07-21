/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, AddModerator } from "@mui/icons-material";
import { IconButton, styled } from "@mui/joy";
import { ChangeEvent, ReactNode, useCallback, useRef } from "react";

import { useSnackbar } from "@eshg/lib-portal";

import { CertificateDialogButton } from "@/lib/components/button/CertificateDialogButton";
import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { EmptyCell } from "@/lib/components/table/cell/common/EmptyCell";
import { getCommonName } from "@/lib/helpers/crypto";
import { isActor } from "@/lib/helpers/entityValidation";
import { ActorData } from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";
import { useTranslation } from "@/lib/i18n/client";

export function CertificateCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  if (!isActor(props.entity)) {
    throw new Error("CertificateCell used with non-actor entity");
  }

  if (props.editable && props.entity.entity?.manualCertificate) {
    return <EditableCertificateCell {...props} />;
  }

  if (!props.entity.entity?.certificate) {
    return <EmptyCell />;
  }
  return <CertificateDialogButton value={props.entity.entity.certificate} />;
}

const HiddenInput = styled("input")({ display: "hidden" });

function EditableCertificateCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { error } = useSnackbar();
  const { t } = useTranslation();
  const updateEntity = useUpdateEntity();

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
        updateEntity(props.entity, {
          commonName,
          [props.id]: {
            signature: "",
            signatory: "",
            value: fr.result,
          },
        });
      };
      fr.readAsText(new Blob([file]));
    },
    [error, props.id, props.entity, updateEntity, t],
  );

  return (
    <>
      <IconButton
        sx={{ display: "inline", minHeight: "24px", minWidth: "24px" }}
        size="sm"
        aria-label={t("certificate")}
        onClick={() => fileInputRef.current?.click()}
      >
        {props.entity.entity?.certificate ? (
          <AddModerator size="sm" />
        ) : (
          <Add size="sm" />
        )}
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
