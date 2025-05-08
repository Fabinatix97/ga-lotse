/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography, styled } from "@mui/joy";
import { ReactNode, useId } from "react";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

export const ExaminationSheet = styled(Sheet)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  overflow: "hidden",
})) as typeof Sheet;

export interface ExaminationTitleProps extends RequiresChildren {
  titleId: string;
}

type TitleComponent = (props: ExaminationTitleProps) => ReactNode;

interface ExaminationSectionProps extends RequiresChildren {
  title: string;
  titleComponent?: TitleComponent;
}

export function ExaminationSection(props: ExaminationSectionProps) {
  const titleId = useId();
  const SectionTitle = props.titleComponent ?? ExaminationSectionTitle;

  return (
    <ExaminationSheet component="section" aria-labelledby={titleId}>
      <SectionTitle titleId={titleId}>{props.title}</SectionTitle>
      <Stack direction="column" gap={2}>
        {props.children}
      </Stack>
    </ExaminationSheet>
  );
}

interface ExaminationSectionTitleProps extends RequiresChildren {
  titleId?: string;
  marginBottom?: number;
}

export function ExaminationSectionTitle(props: ExaminationSectionTitleProps) {
  return (
    <Typography
      id={props.titleId}
      component="h2"
      level="h3"
      marginBottom={props.marginBottom}
    >
      {props.children}
    </Typography>
  );
}

export function ExaminationSectionSecondaryTitle(props: ExaminationTitleProps) {
  return (
    <Typography id={props.titleId} component="h3" level="title-md">
      {props.children}
    </Typography>
  );
}

export function ExaminationSectionHeader(props: RequiresChildren) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      flexWrap="wrap"
    >
      {props.children}
    </Stack>
  );
}
