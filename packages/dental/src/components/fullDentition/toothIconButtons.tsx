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
import { isDefined } from "remeda";

import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import {
  ToothAction,
  ToothActionWithFocusChange,
} from "../../stores/examination/examinationStore";
import { useElementFocus } from "../../stores/examination/hooks/useElementFocus";
import {
  isKeyboardNavigationEvent,
  useKeyboardNavigationHandler,
} from "../../stores/examination/hooks/useKeyboardNavigationHandler";
import {
  QuadrantNumber,
  Tooth,
  ToothContext,
} from "../../stores/examination/types";

import { TOOTH_SIZE } from "./styles";
import { ToothIcon } from "./toothIcons";

interface SizedIconButtonProps {
  isFocused: boolean;
}

const SizedIconButton = styled(IconButton, {
  shouldForwardProp: (propName) => propName !== "isFocused",
})<SizedIconButtonProps>(({ theme, color, isFocused }) => ({
  padding: 0,
  "--Button-focused": isFocused ? "1" : "0",
  ".hover-icon": {
    display: "none",
  },
  "&:is(:hover, :focus-visible):has(.hover-icon)": {
    ".default-icon": {
      display: "none",
    },
    ".hover-icon": {
      display: "inline-flex",
    },
  },
  "&:focus-visible": {
    "--Icon-color": "currentColor",
    backgroundColor: isDefined(color)
      ? theme.palette[color].plainHoverBg
      : undefined,
  },
  ...TOOTH_SIZE,
}));

const IconSizedBox = styled(Box)({
  ...TOOTH_SIZE,
  alignItems: "center",
  justifyContent: "center",
  display: "inline-flex",
  position: "relative",
});

interface ToothIconButtonProps extends Omit<IconButtonProps, "children"> {
  icon: ReactNode;
  hoverIcon?: ReactNode;
  toothContext: ToothContext;
  toothAction: ToothAction | ToothActionWithFocusChange;
}

function ToothIconButton(props: ToothIconButtonProps) {
  const { hoverIcon, icon, toothContext, toothAction, ...buttonProps } = props;

  const { elementRef, isFocused, focusHandler, blurHandler } =
    useElementFocus<HTMLButtonElement>({
      toothContext,
      element: "toothButton",
    });
  const keyboardNavigationHandler = useKeyboardNavigationHandler();

  return (
    <SizedIconButton
      {...buttonProps}
      ref={elementRef}
      variant="plain"
      isFocused={isFocused}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onClick={() => toothAction(toothContext, true)}
      onKeyDown={(event) => {
        if (isKeyboardNavigationEvent(event.code)) {
          keyboardNavigationHandler(event);
          return;
        }
        if (event.code === "Space") {
          toothAction(toothContext, false);
          return;
        }
      }}
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
  const addTooth = useExaminationStore((state) => state.addTooth);

  return (
    <ToothIconButton
      color="primary"
      aria-label="Zahn hinzufügen"
      toothContext={toothContext}
      icon={<RoundedAddIcon />}
      toothAction={addTooth}
    />
  );
}

interface RemoveToothButtonProps {
  tooth: Tooth;
  toothContext: ToothContext;
}

export function RemoveToothButton(props: RemoveToothButtonProps) {
  const removeTooth = useExaminationStore((state) => state.removeTooth);
  return (
    <ToothIconButton
      color="danger"
      aria-label="Zahn entfernen"
      toothContext={props.toothContext}
      icon={<ToothIcon tooth={props.tooth} toothContext={props.toothContext} />}
      hoverIcon={<RoundedDeleteIcon />}
      toothAction={removeTooth}
    />
  );
}

interface ToggleToothTypeButtonProps {
  tooth: Tooth;
  toothContext: ToothContext;
}

export function ToggleToothTypeButton(props: ToggleToothTypeButtonProps) {
  const toggleToothType = useExaminationStore((state) => state.toggleToothType);
  return (
    <ToothIconButton
      color="primary"
      aria-label="Zahntyp wechseln"
      toothContext={props.toothContext}
      icon={<ToothIcon tooth={props.tooth} toothContext={props.toothContext} />}
      hoverIcon={<RoundedChangeIcon />}
      toothAction={toggleToothType}
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
