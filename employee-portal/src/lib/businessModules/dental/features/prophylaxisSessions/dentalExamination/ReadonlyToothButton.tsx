/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, styled } from "@mui/joy";

import { ToothIcon } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Teeth";
import { ToothNumber } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/ToothNumber";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { useElementFocus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/hooks/useElementFocus";
import { useKeyboardNavigationHandler } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/hooks/useKeyboardNavigationHandler";
import {
  ElementContext,
  QuadrantNumber,
  Tooth,
  isToothWithDiagnosis,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { ReadonlyExaminationResult } from "./ReadonlyExaminationResult";

interface FocusableButtonProps {
  focused: boolean;
}

const FocusableButton = styled(Button, {
  shouldForwardProp: (propName) => propName !== "focused",
})<FocusableButtonProps>(({ theme, focused }) => ({
  "--Button-focused": focused ? "1" : "0",
  padding: theme.spacing(0.5),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(2),
  backgroundColor: "none",
  "&:focus-visible": {
    outlineOffset: "-2px",
  },
}));

export interface ReadonlyToothButtonProps {
  quadrantNumber: QuadrantNumber;
  index: number;
  tooth: Tooth;
}

export function ReadonlyToothButton(props: ReadonlyToothButtonProps) {
  const { quadrantNumber, index, tooth } = props;
  const buttonContext: ElementContext = {
    toothContext: {
      quadrantNumber,
      toothIndex: index,
    },
    element: "toothButton",
  };

  const { elementRef, isFocused, focusHandler, blurHandler } =
    useElementFocus<HTMLButtonElement>(buttonContext);
  const navigateTo = useDentalExaminationStore((state) => state.navigateTo);
  const keyboardNavigationHandler = useKeyboardNavigationHandler();

  return (
    <FocusableButton
      ref={elementRef}
      variant="plain"
      focused={isFocused}
      onClick={() => navigateTo(buttonContext.toothContext)}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={keyboardNavigationHandler}
    >
      <ToothNumber tooth={tooth} />
      <ToothIcon
        tooth={tooth}
        toothContext={{ quadrantNumber, toothIndex: index }}
      />
      {isToothWithDiagnosis(tooth) && (
        <ReadonlyExaminationResult tooth={tooth} />
      )}
    </FocusableButton>
  );
}
