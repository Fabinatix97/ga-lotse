/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";

import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";

export interface MultiStepFormButtonBarProps {
  onNextStep?: { title: string; action: () => Promise<void> };
  onPrevStep?: { title: string; action: () => void };
  onCancel?: { title: string; action: () => void };
}
export function MultiStepFormButtonBar(props: MultiStepFormButtonBarProps) {
  const { isFirstStep, isLastStep } = useStepContext();

  return (
    <Stack direction="column" gap={2} width="100%">
      <Button
        type={isLastStep ? "submit" : "button"}
        onClick={!isLastStep ? props.onNextStep?.action : undefined}
      >
        {props.onNextStep?.title}
      </Button>
      {!isFirstStep && (
        <Button variant={"outlined"} onClick={props.onPrevStep?.action}>
          {props.onPrevStep?.title}
        </Button>
      )}
      <Button onClick={props.onCancel?.action} variant="soft" color={"neutral"}>
        {props.onCancel?.title}
      </Button>
    </Stack>
  );
}
