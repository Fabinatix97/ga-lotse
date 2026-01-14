/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Clear, Error as ErrorIcon } from "@mui/icons-material";
import { Box, SvgIcon, styled } from "@mui/joy";
import { memo } from "react";

import {
  Tooth,
  ToothContext,
  hasPreviousExaminationResult,
  isInUpperJaw,
  isToothWithDiagnosis,
} from "../../stores/examination/types";

import { TOOTH_SIZE } from "./styles";

const FILL_COLOR = "#555E68";

type ToothKey = keyof typeof TOOTH_COMPONENTS;

const TOOTH_COMPONENTS = {
  1: IncisorOrPremolarToothIcon,
  2: SmallIncisorIcon,
  3: CuspidIcon,
  4: IncisorOrPremolarToothIcon,
  5: IncisorOrPremolarToothIcon,
  6: MolarIcon,
  7: MolarIcon,
  8: MolarIcon,
} as const;

interface ToothProps {
  tooth: Tooth;
  toothContext: ToothContext;
  className?: string;
}

export function ToothIcon({ tooth, toothContext, className }: ToothProps) {
  const inUpperJaw = isInUpperJaw(tooth);

  if (!isToothWithDiagnosis(tooth)) {
    return <NoToothIcon isInUpperJaw={inUpperJaw} />;
  }

  const toothKey = getToothKey(tooth);
  const ToothIconComponent = TOOTH_COMPONENTS[toothKey];

  return (
    <ToothIconComponent
      isPrimaryTooth={tooth.toothType === "PRIMARY_TOOTH"}
      hasPreviousExaminationResult={hasPreviousExaminationResult(tooth)}
      toothContext={toothContext}
      className={className}
    />
  );
}

interface ToothIconProps {
  hasPreviousExaminationResult: boolean;
  isPrimaryTooth: boolean;
  toothContext: ToothContext;
  className?: string;
}

export function SmallIncisorIcon(props: ToothIconProps) {
  return (
    <MemoizedToothSvgIcon
      {...props}
      toothPath="M11 16C11 12.134 14.134 9 18 9H42C45.866 9 49 12.134 49 16V40C49 43.866 45.866 47 42 47H18C14.134 47 11 43.866 11 40V16Z"
      iconOffset={16}
    />
  );
}

export function IncisorOrPremolarToothIcon(props: ToothIconProps) {
  return (
    <MemoizedToothSvgIcon
      {...props}
      toothPath="M7 8C7 4.134 10.134 1 14 1H46C49.866 1 53 4.134 53 8V40C53 43.866 49.866 47 46 47H14C10.134 47 7 43.866 7 40V26Z"
    />
  );
}

export function CuspidIcon(props: ToothIconProps) {
  return (
    <MemoizedToothSvgIcon
      {...props}
      toothPath="M11 8C11 4.134 14.134 1 18 1H42C45.866 1 49 4.134 49 8V40C49 43.866 45.866 47 42 47H18C14.134 47 11 43.866 11 40V8Z"
    />
  );
}

export function MolarIcon(props: ToothIconProps) {
  return (
    <MemoizedToothSvgIcon
      {...props}
      toothPath="M1 8C1 4.134 4.13401 1 8 1H52C55.866 1 59 4.134 59 8V40C59 43.866 55.866 47 52 47H8C4.13401 47 1 43.866 1 40V8Z"
    />
  );
}

const MemoizedToothSvgIcon = memo(ToothSvgIcon);

interface ToothSvgIconProps {
  className?: string;
  toothPath: string;
  isPrimaryTooth: boolean;
  hasPreviousExaminationResult: boolean;
  iconOffset?: number;
}

function ToothSvgIcon(props: ToothSvgIconProps) {
  return (
    <>
      <SvgIcon
        sx={TOOTH_SIZE}
        viewBox="0 0 60 48"
        fill="none"
        data-testid="tooth-icon"
        className={props.className}
      >
        <path
          d={props.toothPath}
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          strokeWidth="2"
        />
      </SvgIcon>
      {props.hasPreviousExaminationResult && (
        <LayeredErrorIcon offset={props.iconOffset} />
      )}
    </>
  );
}

interface ErrorIconProps {
  offset?: number;
}

function LayeredErrorIcon(props: ErrorIconProps) {
  return (
    <ErrorIconContainer offset={props.offset}>
      <ErrorIcon color="warning" />
    </ErrorIconContainer>
  );
}

const ErrorIconContainer = styled("div", {
  shouldForwardProp: (propName) => propName !== "offset",
})<ErrorIconProps>(({ theme, offset }) => ({
  position: "absolute",
  width: 24,
  height: 24,
  top: offset ?? 12,
  left: 18,
  "&::before": {
    content: '""',
    width: 18,
    height: 18,
    position: "absolute",
    top: 3,
    left: 3,
    backgroundColor: theme.palette.common.white,
    borderRadius: "50%",
  },
  ".MuiSvgIcon-root": {
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

interface NoToothIconProps {
  isInUpperJaw: boolean;
}

function NoToothIcon(props: NoToothIconProps) {
  return (
    <Box
      sx={{
        ...TOOTH_SIZE,
        padding: props.isInUpperJaw
          ? "32px 18px 10px 18px"
          : "10px 18px 32px 18px",
      }}
    >
      <Clear color="neutral" />
    </Box>
  );
}

function getToothKey(tooth: Tooth): ToothKey {
  const toothKey = parseInt(tooth.toothNumber.substring(2, 3));
  if (toothKey < 1 || toothKey > 8) {
    throw new Error("Invalid tooth key");
  }
  return toothKey as ToothKey;
}
