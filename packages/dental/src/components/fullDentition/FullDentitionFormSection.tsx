/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Box,
  Divider,
  Stack,
  Typography,
  TypographyProps,
  styled,
} from "@mui/joy";
import { useId } from "react";

import {
  ButtonLink,
  RequiresChildren,
  useIsBreakpointDown,
} from "@eshg/lib-portal";

import {
  isInLowerJaw,
  isInUpperJaw,
} from "../../stores/examination/actions/utils";
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
  const isMobile = useDetentionFormMediaQuery();

  return (
    <ExaminationSection
      title="Gesamtgebiss"
      titleComponent={FullDentitionHeader}
    >
      <Stack
        direction="column"
        divider={<QuadrantDivider aria-hidden="true" />}
        gap={isMobile ? QUADRANT_SPACING : 0}
        overflow="scroll"
      >
        <JawRow>
          <Quadrant quadrantNumber="Q1" />
          <Quadrant quadrantNumber="Q2" />
        </JawRow>
        <JawRow reverse={!isMobile}>
          <Quadrant quadrantNumber="Q3" />
          <Quadrant quadrantNumber="Q4" />
        </JawRow>
      </Stack>
    </ExaminationSection>
  );
}

function Quadrant(props: { quadrantNumber: QuadrantNumber }) {
  const titleId = useId();
  const isMobile = useDetentionFormMediaQuery();

  const titleAlignSelf =
    props.quadrantNumber === "Q2" || props.quadrantNumber === "Q3"
      ? "flex-end"
      : "flex-start";
  const formAlignSelf =
    props.quadrantNumber === "Q1" || props.quadrantNumber === "Q4"
      ? "flex-end"
      : "flex-start";
  const reverse = !isMobile && isInLowerJaw(props.quadrantNumber);
  const isUpperJaw = isInUpperJaw(props.quadrantNumber);

  return (
    <Stack
      flex={1}
      gap={2}
      direction={reverse ? "column-reverse" : "column"}
      sx={{
        marginTop: isMobile || isUpperJaw ? 0 : QUADRANT_SPACING,
        marginBottom: !isMobile && isUpperJaw ? QUADRANT_SPACING : 0,
      }}
    >
      <QuadrantTitle
        alignSelf={isMobile ? "center" : titleAlignSelf}
        id={titleId}
        quadrantNumber={props.quadrantNumber}
      />
      <Box alignSelf={isMobile ? "center" : formAlignSelf}>
        <QuadrantForm quadrantNumber={props.quadrantNumber} titleId={titleId} />
      </Box>
    </Stack>
  );
}

function FullDentitionHeader(props: ExaminationTitleProps) {
  const findingsOverviewSidebar = useFindingsOverviewSidebar();

  return (
    <Stack direction="row" gap={QUADRANT_SPACING} flexWrap="wrap">
      <Typography id={props.titleId} level="h2">
        {props.children}
      </Typography>
      <ButtonLink
        sx={{ marginLeft: "auto" }}
        onClick={findingsOverviewSidebar.open}
      >
        Befundwerte?
      </ButtonLink>
      <Stack direction="row" flexGrow={1} justifyContent="center">
        <FullDentitionLegend />
      </Stack>
    </Stack>
  );
}

interface ReversableContainerProps extends RequiresChildren {
  reverse?: boolean;
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

function JawRow(props: ReversableContainerProps) {
  const isMobile = useDetentionFormMediaQuery();
  return (
    <Stack
      direction={
        isMobile
          ? props.reverse
            ? "column-reverse"
            : "column"
          : props.reverse
            ? "row-reverse"
            : "row"
      }
      gap={3}
      flexWrap="wrap"
      alignItems={
        isMobile ? "center" : props.reverse ? "flex-start" : "flex-end"
      }
      justifyContent="center"
      divider={
        <QuadrantDivider
          orientation={isMobile ? "horizontal" : "vertical"}
          aria-hidden="true"
        />
      }
    >
      {props.children}
    </Stack>
  );
}

function useDetentionFormMediaQuery() {
  return useIsBreakpointDown("xl");
}
