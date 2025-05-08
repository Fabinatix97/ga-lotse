/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Check,
  DownloadOutlined,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import { Button, Typography, styled } from "@mui/joy";
import { FieldInputProps } from "formik";

import { Row } from "@eshg/lib-portal/components/Row";

interface DownloadDocumentCardProps {
  documentTitle: string;
  downloadLabel: string;
  downloadedLabel: string;
  sectionId?: string;
  hasDownloadedDoc?: boolean;
  fieldInputProps?: FieldInputProps<boolean>;
  ariaPressed?: boolean;
  onClick: () => void;
}
export function DownloadDocumentCard(props: DownloadDocumentCardProps) {
  const hasDownloadedDoc = props.hasDownloadedDoc;
  return (
    <DownloadBox>
      <InsertDriveFileOutlined />
      <Typography id={props.sectionId} level="title-md">
        {props.documentTitle}
      </Typography>
      <Button
        {...props.fieldInputProps}
        sx={{ flex: 1, background: hasDownloadedDoc ? undefined : "white" }}
        color={hasDownloadedDoc ? "success" : "primary"}
        variant={hasDownloadedDoc ? "solid" : "outlined"}
        startDecorator={hasDownloadedDoc ? <Check /> : <DownloadOutlined />}
        aria-pressed={hasDownloadedDoc}
        onClick={props.onClick}
      >
        {hasDownloadedDoc ? props.downloadedLabel : props.downloadLabel}
      </Button>
    </DownloadBox>
  );
}

const DownloadBox = styled(Row)(({ theme }) => ({
  backgroundColor: theme.palette.background.level1,
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  borderRadius: theme.radius.sm,
  alignItems: "center",
}));
