/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/joy";
import SvgIcon from "@mui/joy/SvgIcon";

import { theme } from "@/lib/baseModule/theme/theme";
import { TOOTH_SIZE } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/styles";
import {
  Tooth,
  ToothContext,
  hasPreviousExaminationResult,
  isInUpperJaw,
  isToothWithDiagnosis,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

const FILL_COLOR = "#555E68";

type ToothKey = keyof typeof TOOTH_COMPONENTS;

const TOOTH_COMPONENTS = {
  1: Incisor,
  2: Cuspid,
  3: Cuspid,
  4: Premolar,
  5: Premolar,
  6: Molar,
  7: Molar,
  8: Molar,
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
  const variant = inUpperJaw ? "upperJaw" : "lowerJaw";
  const ToothIconComponent = TOOTH_COMPONENTS[toothKey];

  return (
    <ToothIconComponent
      variant={variant}
      isPrimaryTooth={tooth.toothType === "PRIMARY_TOOTH"}
      hasPreviousExaminationResult={hasPreviousExaminationResult(tooth)}
      toothContext={toothContext}
      className={className}
    />
  );
}

interface ToothIconProps {
  hasPreviousExaminationResult?: boolean;
  isPrimaryTooth?: boolean;
  variant: "upperJaw" | "lowerJaw";
  toothContext: ToothContext;
  className?: string;
}

export function Incisor(props: ToothIconProps) {
  return (
    <ToothSvgIcon className={props.className}>
      <g transform={props.variant === "upperJaw" ? "" : "rotate(180, 30, 33)"}>
        <path
          d="M30.8944 12.0249L34.6584 19.5528C34.9908 20.2177 34.5073 21 33.7639 21H26.2361C25.4927 21 25.0092 20.2177 25.3416 19.5528L29.1056 12.0249C29.4741 11.2879 30.5259 11.2879 30.8944 12.0249Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        <path
          d="M11 34C11 30.134 14.134 27 18 27H42C45.866 27 49 30.134 49 34V58C49 61.866 45.866 65 42 65H18C14.134 65 11 61.866 11 58V34Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        {props.hasPreviousExaminationResult && (
          <g
            transform={
              props.variant === "upperJaw" ? "" : "rotate(180, 30, 46)"
            }
          >
            <path
              d="M21 46C21 41.0294 25.0294 37 30 37C34.9706 37 39 41.0294 39 46C39 50.9706 34.9706 55 30 55C25.0294 55 21 50.9706 21 46Z"
              fill={theme.palette.danger.solidBg}
            />
            <path
              d="M30.616 41.66L30.46 47.48H29.32L29.164 41.66H30.616ZM29.932 50.084C29.684 50.084 29.476 50 29.308 49.832C29.14 49.664 29.056 49.456 29.056 49.208C29.056 48.96 29.14 48.752 29.308 48.584C29.476 48.416 29.684 48.332 29.932 48.332C30.172 48.332 30.376 48.416 30.544 48.584C30.712 48.752 30.796 48.96 30.796 49.208C30.796 49.456 30.712 49.664 30.544 49.832C30.376 50 30.172 50.084 29.932 50.084Z"
              fill="white"
            />
          </g>
        )}
      </g>
    </ToothSvgIcon>
  );
}

export function Premolar(props: ToothIconProps) {
  return (
    <ToothSvgIcon className={props.className}>
      <g transform={props.variant === "upperJaw" ? "" : "rotate(180, 30, 33)"}>
        <path
          d="M22.8944 4.02492L26.6584 11.5528C26.9908 12.2177 26.5073 13 25.7639 13H18.2361C17.4927 13 17.0092 12.2177 17.3416 11.5528L21.1056 4.02492C21.4741 3.28787 22.5259 3.28787 22.8944 4.02492Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        <path
          d="M38.8944 4.02492L42.6584 11.5528C42.9908 12.2177 42.5073 13 41.7639 13H34.2361C33.4927 13 33.0092 12.2177 33.3416 11.5528L37.1056 4.02492C37.4741 3.28787 38.5259 3.28787 38.8944 4.02492Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        <path
          d="M7 26C7 22.134 10.134 19 14 19H46C49.866 19 53 22.134 53 26V58C53 61.866 49.866 65 46 65H14C10.134 65 7 61.866 7 58V26Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        {props.hasPreviousExaminationResult && (
          <g
            transform={
              props.variant === "upperJaw" ? "" : "rotate(180, 30, 42)"
            }
          >
            <path
              d="M21 42C21 37.0294 25.0294 33 30 33C34.9706 33 39 37.0294 39 42C39 46.9706 34.9706 51 30 51C25.0294 51 21 46.9706 21 42Z"
              fill={theme.palette.danger.solidBg}
            />
            <path
              d="M30.616 37.66L30.46 43.48H29.32L29.164 37.66H30.616ZM29.932 46.084C29.684 46.084 29.476 46 29.308 45.832C29.14 45.664 29.056 45.456 29.056 45.208C29.056 44.96 29.14 44.752 29.308 44.584C29.476 44.416 29.684 44.332 29.932 44.332C30.172 44.332 30.376 44.416 30.544 44.584C30.712 44.752 30.796 44.96 30.796 45.208C30.796 45.456 30.712 45.664 30.544 45.832C30.376 46 30.172 46.084 29.932 46.084Z"
              fill="white"
            />
          </g>
        )}
      </g>
    </ToothSvgIcon>
  );
}

export function Cuspid(props: ToothIconProps) {
  return (
    <ToothSvgIcon className={props.className}>
      <g transform={props.variant === "upperJaw" ? "" : "rotate(180, 30, 33)"}>
        <path
          d="M30.8944 4.02492L34.6584 11.5528C34.9908 12.2177 34.5073 13 33.7639 13H26.2361C25.4927 13 25.0092 12.2177 25.3416 11.5528L29.1056 4.02492C29.4741 3.28787 30.5259 3.28787 30.8944 4.02492Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        <path
          d="M11 26C11 22.134 14.134 19 18 19H42C45.866 19 49 22.134 49 26V58C49 61.866 45.866 65 42 65H18C14.134 65 11 61.866 11 58V26Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          stroke-width="2"
        />
        {props.hasPreviousExaminationResult && (
          <g
            transform={
              props.variant === "upperJaw" ? "" : "rotate(180, 30, 42)"
            }
          >
            <path
              d="M21 42C21 37.0294 25.0294 33 30 33C34.9706 33 39 37.0294 39 42C39 46.9706 34.9706 51 30 51C25.0294 51 21 46.9706 21 42Z"
              fill={theme.palette.danger.solidBg}
            />
            <path
              d="M30.616 37.66L30.46 43.48H29.32L29.164 37.66H30.616ZM29.932 46.084C29.684 46.084 29.476 46 29.308 45.832C29.14 45.664 29.056 45.456 29.056 45.208C29.056 44.96 29.14 44.752 29.308 44.584C29.476 44.416 29.684 44.332 29.932 44.332C30.172 44.332 30.376 44.416 30.544 44.584C30.712 44.752 30.796 44.96 30.796 45.208C30.796 45.456 30.712 45.664 30.544 45.832C30.376 46 30.172 46.084 29.932 46.084Z"
              fill="white"
            />
          </g>
        )}
      </g>
    </ToothSvgIcon>
  );
}

export function Molar(props: ToothIconProps) {
  return (
    <ToothSvgIcon className={props.className}>
      <g transform={props.variant === "upperJaw" ? "" : "rotate(180, 30, 33)"}>
        <path
          d="M14.8944 4.02492L18.6584 11.5528C18.9908 12.2177 18.5073 13 17.7639 13H10.2361C9.49269 13 9.00919 12.2177 9.34164 11.5528L13.1056 4.02492C13.4741 3.28787 14.5259 3.28787 14.8944 4.02492Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          strokeWidth="2"
        />
        <path
          d="M30.8944 4.02492L34.6584 11.5528C34.9908 12.2177 34.5073 13 33.7639 13H26.2361C25.4927 13 25.0092 12.2177 25.3416 11.5528L29.1056 4.02492C29.4741 3.28787 30.5259 3.28787 30.8944 4.02492Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          strokeWidth="2"
        />
        <path
          d="M46.8944 4.02492L50.6584 11.5528C50.9908 12.2177 50.5073 13 49.7639 13H42.2361C41.4927 13 41.0092 12.2177 41.3416 11.5528L45.1056 4.02492C45.4741 3.28787 46.5259 3.28787 46.8944 4.02492Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          strokeWidth="2"
        />
        <path
          d="M1 26C1 22.134 4.13401 19 8 19H52C55.866 19 59 22.134 59 26V58C59 61.866 55.866 65 52 65H8C4.13401 65 1 61.866 1 58V26Z"
          fill={props.isPrimaryTooth ? "white" : FILL_COLOR}
          stroke={FILL_COLOR}
          strokeWidth="2"
        />
        {props.hasPreviousExaminationResult && (
          <g
            transform={
              props.variant === "upperJaw" ? "" : "rotate(180, 30, 42)"
            }
          >
            <path
              d="M21 42C21 37.0294 25.0294 33 30 33C34.9706 33 39 37.0294 39 42C39 46.9706 34.9706 51 30 51C25.0294 51 21 46.9706 21 42Z"
              fill={theme.palette.danger.solidBg}
            />
            <path
              d="M30.616 37.66L30.46 43.48H29.32L29.164 37.66H30.616ZM29.932 46.084C29.684 46.084 29.476 46 29.308 45.832C29.14 45.664 29.056 45.456 29.056 45.208C29.056 44.96 29.14 44.752 29.308 44.584C29.476 44.416 29.684 44.332 29.932 44.332C30.172 44.332 30.376 44.416 30.544 44.584C30.712 44.752 30.796 44.96 30.796 45.208C30.796 45.456 30.712 45.664 30.544 45.832C30.376 46 30.172 46.084 29.932 46.084Z"
              fill="white"
            />
          </g>
        )}
      </g>
    </ToothSvgIcon>
  );
}

function ToothSvgIcon(props: RequiresChildren & { className?: string }) {
  return (
    <SvgIcon
      sx={TOOTH_SIZE}
      viewBox="0 0 60 66"
      fill="none"
      data-testid="tooth-icon"
      className={props.className}
    >
      {props.children}
    </SvgIcon>
  );
}

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
      <ClearIcon color="neutral" />
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
