/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography, TypographyProps, styled } from "@mui/joy";
import { useId } from "react";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { QuadrantNumber } from "../../stores/examination/types";
import { QUADRANT_NAMES } from "../../translations/examination";
import {
  ExaminationSection,
  ExaminationTitleProps,
} from "../examination/ExaminationSection";

import { useFindingsOverviewSidebar } from "./FindingsOverviewSidebar";
import { FullDentitionLegend } from "./FullDentitionLegend";
import { QuadrantForm } from "./quadrant";
import { QUADRANT_SPACING } from "./styles";

const QuadrantDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

export function FullDentitionFormSection() {
  const q1TitleId = useId();
  const q2TitleId = useId();
  const q3TitleId = useId();
  const q4TitleId = useId();

  return (
    <ExaminationSection
      title="Gesamtgebiss"
      titleComponent={FullDentitionHeader}
    >
      <JawHeaderRow>
        <QuadrantTitle id={q1TitleId} quadrantNumber="Q1" />
        <QuadrantTitle id={q2TitleId} quadrantNumber="Q2" />
      </JawHeaderRow>
      <Stack
        direction="column"
        divider={<QuadrantDivider aria-hidden="true" />}
      >
        <JawRow>
          <QuadrantForm quadrantNumber="Q1" titleId={q1TitleId} />
          <QuadrantForm quadrantNumber="Q2" titleId={q2TitleId} />
        </JawRow>
        <JawRow>
          <QuadrantForm quadrantNumber="Q4" titleId={q4TitleId} />
          <QuadrantForm quadrantNumber="Q3" titleId={q3TitleId} />
        </JawRow>
      </Stack>
      <JawHeaderRow>
        <QuadrantTitle id={q4TitleId} quadrantNumber="Q4" />
        <QuadrantTitle id={q3TitleId} quadrantNumber="Q3" />
      </JawHeaderRow>
    </ExaminationSection>
  );
}

function FullDentitionHeader(props: ExaminationTitleProps) {
  const findingsOverviewSidebar = useFindingsOverviewSidebar();

  return (
    <Stack direction="row" gap={QUADRANT_SPACING} flexWrap="wrap">
      <Typography id={props.titleId} level="h2">
        {props.children}
      </Typography>
      <Stack
        direction="row"
        flexGrow={1}
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <ButtonLink onClick={findingsOverviewSidebar.open}>
          Befundwerte?
        </ButtonLink>
        <FullDentitionLegend />
      </Stack>
    </Stack>
  );
}

function JawHeaderRow(props: RequiresChildren) {
  return (
    <Stack direction="row" gap={3} justifyContent="space-between">
      {props.children}
    </Stack>
  );
}

interface QuadrantTitleProps extends Pick<TypographyProps, "id" | "alignSelf"> {
  quadrantNumber: QuadrantNumber;
}

function QuadrantTitle(props: QuadrantTitleProps) {
  const { quadrantNumber, ...headingProps } = props;

  return (
    <Typography component="h3" level="body-md" {...headingProps}>
      <Typography component="span" level="title-md">
        {QUADRANT_NAMES[quadrantNumber]}
      </Typography>{" "}
      - Quadrant {quadrantNumber.substring(1, 2)}
    </Typography>
  );
}

function JawRow(props: RequiresChildren) {
  return (
    <Stack
      direction="row"
      gap={3}
      flexWrap="wrap"
      alignItems="flex-start"
      justifyContent="center"
      divider={<QuadrantDivider orientation="vertical" aria-hidden="true" />}
    >
      {props.children}
    </Stack>
  );
}
