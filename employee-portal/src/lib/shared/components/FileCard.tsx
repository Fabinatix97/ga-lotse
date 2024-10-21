/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiFileType } from "@eshg/employee-portal-api/businessProcedures";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import {
  AspectRatio,
  Card,
  CardContent,
  ColorPaletteProp,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useRouter } from "next/navigation";
import { ReactNode, createElement } from "react";
import { isDefined } from "remeda";

import { formatFileSize } from "@/lib/shared/helpers/file";

import { ActionsMenu } from "./buttons/ActionsMenu";

export interface FileCardActionProps {
  onClick: string | (() => Promise<void> | void);
  name: string;
  indicator: ReactNode;
  color: ColorPaletteProp;
  disabled?: boolean;
}

export const CustomFileType = {
  Audio: "AUDIO",
  Csv: "CSV",
} as const;
export type NonApiFileType =
  (typeof CustomFileType)[keyof typeof CustomFileType];

export interface FileCardProps {
  name: string;
  type: ApiFileType | NonApiFileType;
  creationDate: Date;
  size: number;
  actions: FileCardActionProps[];
  sx?: SxProps;
}

const iconByType = {
  JPEG: ImageOutlinedIcon,
  PNG: ImageOutlinedIcon,
  PDF: PictureAsPdfOutlinedIcon,
  EML: AlternateEmailOutlinedIcon,
  AUDIO: AudioFileOutlinedIcon,
  CSV: ListAltOutlined,
} as const;

export function FileCard(props: FileCardProps) {
  return (
    <Card
      orientation="horizontal"
      sx={{ backgroundColor: "white", "--Card-padding": "0.5rem", ...props.sx }}
      size="sm"
      data-testid="fileCard"
    >
      <AspectRatio
        ratio="1"
        variant="soft"
        color="neutral"
        sx={{ minWidth: 48, borderRadius: "10%", svg: { fontSize: "24px" } }}
      >
        <div>{createElement(iconByType[props.type])}</div>
      </AspectRatio>
      <CardContent sx={{ justifyContent: "space-between" }}>
        <Typography level="body-sm" sx={{ wordBreak: "break-word" }}>
          {props.name}
        </Typography>
        <Stack direction="row" justifyContent="space-between" gap={3}>
          <Stack direction="row" gap={3}>
            <Typography level="body-sm" textColor="text.secondary">
              {formatDate(props.creationDate)}
            </Typography>
            <Typography level="body-sm" textColor="text.secondary">
              {formatFileSize(props.size)}
            </Typography>
          </Stack>
          <FileCardButton actions={props.actions} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function FileCardButton({ actions }: { actions: FileCardActionProps[] }) {
  if (actions.length == 0) return <></>;
  if (actions.length > 1) return <FileCardMenuButton actions={actions} />;
  const onlyAction = actions[0];
  return isDefined(onlyAction) ? (
    <FileCardActionButton {...onlyAction} />
  ) : (
    <></>
  );
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
      onClick={onClick}
      disabled={props.disabled}
    >
      {props.indicator}
    </IconButton>
  );
}

function FileCardMenuButton({ actions }: { actions: FileCardActionProps[] }) {
  return (
    <ActionsMenu
      actionItems={actions.map((action) => ({
        label: action.name,
        onClick: action.onClick,
        startDecorator: action.indicator,
        color: action.color,
        disabled: action.disabled,
      }))}
      color="neutral"
      sx={{ "--IconButton-size": "1.5rem" }}
    />
  );
}
