/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  Check,
  DownloadOutlined,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Typography,
  styled,
} from "@mui/joy";
import assert from "assert";
import { useId } from "react";

import { useAnonymousIdentificationDocumentQuery } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";

export interface DownloadDocumentCardFieldProps {
  documentTitle: string;
  required: string;
  hint: string;
  downloadLabel: string;
  downloadedLabel: string;
}
export function DownloadDocumentCardField(
  props: DownloadDocumentCardFieldProps,
) {
  const { input, error, helperText, helpers } = useBaseField<boolean>({
    name: "hasDownloadedDoc",
    hint: props.hint,
    required: props.required,
    validate: (v) => (v === true ? undefined : props.required),
  });
  const hasDownloadedDoc = input.value;

  const [{ procedureId }] = useFormData<AppointmentFormData>();
  assert.ok(procedureId);
  const document = useAnonymousIdentificationDocumentQuery(procedureId);

  async function downloadAnonIdentificationDoc() {
    await document.download();
    await helpers.setValue(true);
  }

  const sectionDescId = useId();
  return (
    <FormControl
      error={error}
      component={"section"}
      aria-describedby={sectionDescId}
    >
      <DownloadBox>
        <InsertDriveFileOutlined />
        <Typography id={sectionDescId} level="title-md">
          {props.documentTitle}
        </Typography>
        <Button
          {...input}
          sx={{ flex: 1, background: hasDownloadedDoc ? undefined : "white" }}
          color={hasDownloadedDoc ? "success" : "primary"}
          variant={hasDownloadedDoc ? "solid" : "outlined"}
          startDecorator={hasDownloadedDoc ? <Check /> : <DownloadOutlined />}
          aria-pressed={hasDownloadedDoc}
          onClick={() => downloadAnonIdentificationDoc()}
        >
          {hasDownloadedDoc ? props.downloadedLabel : props.downloadLabel}
        </Button>
      </DownloadBox>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

const DownloadBox = styled(Row)(({ theme }) => ({
  backgroundColor: theme.palette.background.level1,
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  borderRadius: theme.radius.sm,
  alignItems: "center",
}));
