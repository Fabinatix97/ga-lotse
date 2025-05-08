/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from "@mui/icons-material";
import {
  Stack,
  Step,
  StepButton,
  StepButtonProps,
  StepProps,
  Typography,
} from "@mui/joy";
import { PropsWithChildren, ReactNode } from "react";
import { isDefined, isNonNullish } from "remeda";

import { TimelineEntryIndicator } from "./TimelineEntryIndicator";

export type TimelineEntryProps = Omit<StepProps, "title"> &
  TitleAndLabel & {
    titleLink?: ReactNode;
    buttonProps?: StepButtonProps;
  };

interface TitleAndLabel {
  label: ReactNode;
  title: ReactNode;
}

export function TimelineEntry({
  label,
  title,
  buttonProps,
  indicator,
  ...stepProps
}: TimelineEntryProps) {
  return (
    <Step
      indicator={
        isNonNullish(indicator) ? (
          indicator
        ) : (
          <TimelineEntryIndicator color="success">
            <Check />
          </TimelineEntryIndicator>
        )
      }
      {...stepProps}
    >
      {isDefined(buttonProps) ? (
        <StepButton {...buttonProps}>
          <Content label={label} title={title}>
            {stepProps.children}
          </Content>
        </StepButton>
      ) : (
        <Content label={label} title={title}>
          {stepProps.children}
        </Content>
      )}
    </Step>
  );
}

function Content(props: PropsWithChildren<TitleAndLabel>) {
  return (
    <>
      <Typography level="body-xs">
        {props.label}
        <br />
        <Typography level="title-sm">{props.title}</Typography>
      </Typography>
      <Stack spacing={1}>{props.children}</Stack>
    </>
  );
}
