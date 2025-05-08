/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";

import { useLayoutConfig } from "../../contexts/layoutConfig";

interface ToolbarStackProps {
  height: string;
}

const ToolbarStack = styled(Stack, {
  shouldForwardProp: (propName) => propName !== "height",
})<ToolbarStackProps>(({ theme, height }) => ({
  height,
  backgroundColor: theme.palette.background.body,
  borderStyle: "solid",
  borderColor: theme.palette.divider,
  borderWidth: 0,
  borderBottomWidth: 1,
  boxSizing: "border-box",
}));

const TitleStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(1),
  alignItems: "center",
  justifyContent: "space-between",
  paddingInline: theme.spacing(3),
}));

export interface ToolbarProps {
  title: string;
  backButton?: ReactNode;
  afterTitle?: ReactNode;
}

export function Toolbar(props: ToolbarProps) {
  const { title, backButton, afterTitle } = props;
  const { simpleToolbarHeight } = useLayoutConfig();

  return (
    <ToolbarStack
      direction="row"
      height={simpleToolbarHeight}
      divider={<Divider orientation="vertical" />}
    >
      {backButton}
      <TitleStack direction="row">
        <Typography component="h1" level="h2">
          {title}
        </Typography>
        {afterTitle}
      </TitleStack>
    </ToolbarStack>
  );
}
