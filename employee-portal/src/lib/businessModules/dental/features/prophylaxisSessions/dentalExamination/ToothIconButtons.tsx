/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Box,
  IconButton,
  IconButtonProps,
  SvgIcon,
  styled,
  useTheme,
} from "@mui/joy";
import { ReactNode } from "react";

import { ToothIcon } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Teeth";
import { TOOTH_SIZE } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/styles";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { useElementFocus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/hooks/useElementFocus";
import { useKeyboardNavigationHandler } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/hooks/useKeyboardNavigationHandler";
import {
  QuadrantNumber,
  Tooth,
  ToothContext,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export const SizedIconButton = styled(IconButton)({
  padding: 0,
  ...TOOTH_SIZE,
});

const IconSizedBox = styled(Box)({
  ...TOOTH_SIZE,
  alignItems: "center",
  justifyContent: "center",
  display: "inline-flex",
});

interface ToothIconButtonProps extends Omit<IconButtonProps, "children"> {
  icon: ReactNode;
  hoverIcon?: ReactNode;
  toothContext: ToothContext;
}

function ToothIconButton(props: ToothIconButtonProps) {
  const { hoverIcon, icon, toothContext, ...buttonProps } = props;

  const { elementRef, isFocused, focusHandler, blurHandler } =
    useElementFocus<HTMLButtonElement>({
      toothContext,
      element: "toothButton",
    });
  const keyboardNavigationHandler = useKeyboardNavigationHandler();

  return (
    <SizedIconButton
      {...buttonProps}
      variant="plain"
      ref={elementRef}
      sx={{
        "--Button-focused": isFocused ? "1" : "0",
        ".hover-icon": {
          display: "none",
        },
        ...(hoverIcon && {
          "&:hover, &:focus-visible": {
            ".default-icon": {
              display: "none",
            },
            ".hover-icon": {
              display: "inline-flex",
            },
          },
        }),
      }}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={keyboardNavigationHandler}
    >
      <IconSizedBox className="default-icon">{icon}</IconSizedBox>
      {hoverIcon && (
        <IconSizedBox className="hover-icon" sx={{ padding: "auto" }}>
          {hoverIcon}
        </IconSizedBox>
      )}
    </SizedIconButton>
  );
}

interface AddToothButtonProps {
  index: number;
  quadrantNumber: QuadrantNumber;
}

export function AddToothButton(props: AddToothButtonProps) {
  const toothContext: ToothContext = {
    quadrantNumber: props.quadrantNumber,
    toothIndex: props.index,
  };
  const addTooth = useDentalExaminationStore((state) => state.addTooth);

  return (
    <ToothIconButton
      color="primary"
      aria-label="Zahn hinzufügen"
      toothContext={toothContext}
      onClick={() => {
        addTooth(toothContext);
      }}
      icon={<RoundedAddIcon />}
    />
  );
}

interface RemoveToothButtonProps {
  tooth: Tooth;
  toothContext: ToothContext;
}

export function RemoveToothButton(props: RemoveToothButtonProps) {
  const removeTooth = useDentalExaminationStore((state) => state.removeTooth);
  return (
    <ToothIconButton
      color="danger"
      aria-label="Zahn entfernen"
      toothContext={props.toothContext}
      onClick={() => removeTooth(props.toothContext)}
      icon={<ToothIcon tooth={props.tooth} toothContext={props.toothContext} />}
      hoverIcon={<RoundedDeleteIcon />}
    />
  );
}

interface ToggleToothTypeButtonProps {
  tooth: Tooth;
  toothContext: ToothContext;
}

export function ToggleToothTypeButton(props: ToggleToothTypeButtonProps) {
  const toggleToothType = useDentalExaminationStore(
    (state) => state.toggleToothType,
  );
  return (
    <ToothIconButton
      color="primary"
      aria-label="Zahntyp wechseln"
      toothContext={props.toothContext}
      onClick={() => toggleToothType(props.toothContext)}
      icon={<ToothIcon tooth={props.tooth} toothContext={props.toothContext} />}
      hoverIcon={<RoundedChangeIcon />}
    />
  );
}

const IconSizedSvg = styled(SvgIcon)({
  height: 24,
  width: 24,
});

function RoundedAddIcon() {
  const theme = useTheme();
  return (
    <IconSizedSvg viewBox="0 0 24 24">
      <rect
        width="24"
        height="24"
        rx="12"
        fill={theme.palette.primary.solidBg}
      />
      <path
        d="M16.6666 12.6668H12.6666V16.6668H11.3333V12.6668H7.33331V11.3335H11.3333V7.3335H12.6666V11.3335H16.6666V12.6668Z"
        fill={theme.palette.common.white}
      />
    </IconSizedSvg>
  );
}

function RoundedDeleteIcon() {
  const theme = useTheme();
  return (
    <IconSizedSvg viewBox="0 0 24 24">
      <rect
        width="24"
        height="24"
        rx="12"
        fill={theme.palette.danger.solidBg}
      />
      <path
        d="M14.6667 10V16.6667H9.33334V10H14.6667ZM13.6667 6H10.3333L9.66667 6.66667H7.33334V8H16.6667V6.66667H14.3333L13.6667 6ZM16 8.66667H8V16.6667C8 17.4 8.6 18 9.33334 18H14.6667C15.4 18 16 17.4 16 16.6667V8.66667Z"
        fill={theme.palette.common.white}
      />
    </IconSizedSvg>
  );
}

function RoundedChangeIcon() {
  const theme = useTheme();
  return (
    <IconSizedSvg viewBox="0 0 24 24">
      <rect
        width="24"
        height="24"
        rx="12"
        fill={theme.palette.primary.solidBg}
      />
      <path
        d="M16.6666 9.33317L14 11.9998H16C16 14.2065 14.2066 15.9998 12 15.9998C11.3266 15.9998 10.6866 15.8332 10.1333 15.5332L9.15996 16.5065C9.97996 17.0265 10.9533 17.3332 12 17.3332C14.9466 17.3332 17.3333 14.9465 17.3333 11.9998H19.3333L16.6666 9.33317ZM7.99996 11.9998C7.99996 9.79317 9.79329 7.99984 12 7.99984C12.6733 7.99984 13.3133 8.1665 13.8666 8.4665L14.84 7.49317C14.02 6.97317 13.0466 6.6665 12 6.6665C9.05329 6.6665 6.66663 9.05317 6.66663 11.9998H4.66663L7.33329 14.6665L9.99996 11.9998H7.99996Z"
        fill="white"
      />
    </IconSizedSvg>
  );
}
