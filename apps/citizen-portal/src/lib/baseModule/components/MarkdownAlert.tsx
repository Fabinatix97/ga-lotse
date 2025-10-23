/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccountCircleOutlined,
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  InfoOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert as AlertJoy,
  AlertProps as AlertPropsJoy,
  List,
  ListItem,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode, Ref } from "react";

import {
  ExternalLink,
  Markdown,
  Row,
  defaultComponents,
} from "@eshg/lib-portal";

function renderIcon(color: AlertPropsJoy["color"]): ReactNode {
  switch (color) {
    case "primary":
      return <InfoOutlined fontSize="xl2" />;
    case "success":
      return <CheckCircleOutlined fontSize="xl2" />;
    case "warning":
      return <WarningAmberOutlined fontSize="xl2" />;
    case "danger":
      return <ErrorOutlineOutlined fontSize="xl2" />;
    case "neutral":
    case undefined:
      return <AccountCircleOutlined fontSize="xl2" />;
  }
}

function getComponents(
  color: AlertPropsJoy["color"],
  variant: Extract<AlertPropsJoy["variant"], "soft" | "outlined">,
): typeof defaultComponents {
  return {
    h2: (props) => (
      <Typography component="h2" level="h2" color={color} variant={variant}>
        {props.children}
      </Typography>
    ),
    h3: (props) => (
      <Typography component="h3" level="h3" color={color} variant={variant}>
        {props.children}
      </Typography>
    ),
    p: (props) => (
      <Typography color={color} variant={variant} component="p">
        {props.children}
      </Typography>
    ),
    a: (props) => (
      <ExternalLink
        href={props.href}
        openInNewTab
        color={color}
        variant={variant}
      >
        {props.children}
      </ExternalLink>
    ),
    ul: (props) => (
      <List marker="disc" color={color} variant={variant}>
        {props.children}
      </List>
    ),
    li: (props) => (
      <ListItem color={color} variant={variant}>
        {props.children}
      </ListItem>
    ),
  };
}

export interface MarkdownAlertProps {
  source: string;
  color: AlertPropsJoy["color"];
  variant?: Extract<AlertPropsJoy["variant"], "soft" | "outlined">;
  sx?: SxProps;
  ref?: Ref<HTMLDivElement>;
  role?: string;
}

export function MarkdownAlert({
  ref,
  source,
  color,
  variant = "soft",
  sx,
  role = "note",
}: MarkdownAlertProps) {
  return (
    <AlertJoy
      ref={ref}
      variant={variant}
      color={color}
      sx={{ ...sx, alignItems: "flex-start" }}
      startDecorator={renderIcon(color)}
      role={role}
      data-testid="alert"
    >
      <Row justifyContent="space-between" flex="1">
        <Markdown components={getComponents(color, variant)} source={source} />
      </Row>
    </AlertJoy>
  );
}
