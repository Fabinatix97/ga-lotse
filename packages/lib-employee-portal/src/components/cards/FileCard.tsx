/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AlternateEmailOutlined,
  AudioFileOutlined,
  ImageOutlined,
  ListAltOutlined,
  PictureAsPdfOutlined,
  Web,
} from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  ColorPaletteProp,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useRouter } from "next/navigation";
import { FunctionComponent, ReactNode, createElement } from "react";
import { isDefined } from "remeda";

import { formatDate, formatFileSize } from "@eshg/lib-portal";
import { ApiAbstractFile, ApiFileType } from "@eshg/lib-procedures-api";

import { ActionsMenu } from "../buttons/ActionsMenu";

export interface FileCardActionProps {
  onClick: string | (() => Promise<void> | void);
  name: string;
  indicator: ReactNode;
  color?: ColorPaletteProp;
  disabled?: boolean;
}

export const CustomFileType = {
  Audio: "AUDIO",
  Csv: "CSV",
  Md: "MD",
  Yaml: "YAML",
  Svg: "SVG",
} as const;
export type CustomFileType =
  (typeof CustomFileType)[keyof typeof CustomFileType];

export interface FileCardProps {
  name: string;
  type: ApiFileType | CustomFileType;
  creationDate?: Date;
  size: number;
  actions: FileCardActionProps[];
  sx?: SxProps;
  actionMenuButtonColor?: ColorPaletteProp;
  role?: string;
}

const iconByType = {
  JPEG: ImageOutlined,
  PNG: ImageOutlined,
  PDF: PictureAsPdfOutlined,
  EML: AlternateEmailOutlined,
  AUDIO: AudioFileOutlined,
  CSV: ListAltOutlined,
  MD: Web,
  YAML: Web,
  SVG: ImageOutlined,
} as const satisfies Record<ApiFileType | CustomFileType, FunctionComponent>;

export function FileCard(props: FileCardProps) {
  return (
    <Card
      orientation="horizontal"
      sx={{ backgroundColor: "white", "--Card-padding": "0.5rem", ...props.sx }}
      size="sm"
      data-testid="fileCard"
      role={props.role}
    >
      <AspectRatio
        ratio="1"
        variant="soft"
        color="neutral"
        sx={{ minWidth: 48, borderRadius: "10%", svg: { fontSize: "24px" } }}
      >
        <Box role="img" aria-label={`Dateityp: ${props.type}`}>
          {createElement(iconByType[props.type])}
        </Box>
      </AspectRatio>
      <CardContent sx={{ justifyContent: "space-between" }}>
        <Typography level="body-sm" sx={{ wordBreak: "break-word" }}>
          {props.name}
        </Typography>
        <Stack direction="row" justifyContent="space-between" gap={3}>
          <Stack direction="row" gap={3}>
            {isDefined(props.creationDate) && (
              <Typography level="body-sm" textColor="text.secondary">
                {formatDate(props.creationDate)}
              </Typography>
            )}
            <Typography level="body-sm" textColor="text.secondary">
              {formatFileSize(props.size)}
            </Typography>
          </Stack>
          <FileCardButton
            color={props.actionMenuButtonColor}
            actions={props.actions}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function FileCardButton({
  actions,
  color,
}: {
  actions: FileCardActionProps[];
  color?: ColorPaletteProp;
}) {
  if (actions.length === 0) return null;
  if (actions.length > 1)
    return <FileCardMenuButton color={color} actions={actions} />;
  const onlyAction = actions[0];
  return isDefined(onlyAction) ? (
    <FileCardActionButton {...onlyAction} />
  ) : null;
}

function FileCardActionButton(props: FileCardActionProps) {
  const router = useRouter();
  const onClick =
    typeof props.onClick === "string"
      ? () => router.push(props.onClick as string)
      : props.onClick;
  return (
    <IconButton
      aria-label={props.name}
      color={props.color}
      sx={{ "--IconButton-size": "1.5rem" }}
      disabled={props.disabled}
      onClick={onClick}
    >
      {props.indicator}
    </IconButton>
  );
}

function FileCardMenuButton({
  actions,
  color,
}: {
  actions: FileCardActionProps[];
  color?: ColorPaletteProp;
}) {
  return (
    <ActionsMenu
      actionItems={actions.map((action) => ({
        label: action.name,
        onClick: action.onClick,
        startDecorator: action.indicator,
        color: action.color,
        disabled: action.disabled,
      }))}
      color={color ?? "neutral"}
      sx={{ "--IconButton-size": "1.5rem" }}
    />
  );
}

export function mapToFileCardProps(
  apiFile: ApiAbstractFile,
): Omit<FileCardProps, "onClick" | "actions"> {
  return {
    name: apiFile.fileName,
    type: apiFile.fileType,
    creationDate: apiFile.createdAt,
    size: apiFile.fileSizeBytes,
  };
}
