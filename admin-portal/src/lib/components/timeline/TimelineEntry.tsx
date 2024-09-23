/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CheckIcon from "@mui/icons-material/Check";
import {
  Stack,
  Step,
  StepButton,
  StepButtonProps,
  StepProps,
  Typography,
} from "@mui/joy";
import { PropsWithChildren, ReactNode } from "react";
import { isDefined } from "remeda";

import { TimelineEntryIndicator } from "./TimelineEntryIndicator";

export type TimelineEntryProps = Omit<StepProps, "title"> &
  TitleAndLabel & {
    titleLink?: ReactNode;
    buttonProps?: StepButtonProps;
  };

interface TitleAndLabel {
  label: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
}

export function TimelineEntry({
  label,
  title,
  subtitle,
  buttonProps,
  indicator,
  ...stepProps
}: TimelineEntryProps) {
  return (
    <Step
      indicator={
        isDefined(indicator) ? (
          indicator
        ) : (
          <TimelineEntryIndicator color={"success"}>
            <CheckIcon />
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
        <Content label={label} title={title} subtitle={subtitle}>
          {stepProps.children}
        </Content>
      )}
    </Step>
  );
}

function Content(props: PropsWithChildren<TitleAndLabel>) {
  return (
    <>
      <Typography level={"body-xs"}>
        {props.label}
        <br />
        <Typography level={"title-sm"}>{props.title}</Typography>
        {props.subtitle && (
          <>
            <br />
            <Typography level={"body-sm"}>{props.subtitle}</Typography>
          </>
        )}
      </Typography>
      <Stack spacing={1}>{props.children}</Stack>
    </>
  );
}
