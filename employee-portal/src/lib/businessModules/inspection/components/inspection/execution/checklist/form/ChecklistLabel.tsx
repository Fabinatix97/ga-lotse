/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormHelperText, FormLabel, Stack } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined, isNonNullish } from "remeda";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { theme } from "@/lib/baseModule/theme/theme";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

interface ChecklistLabelProps extends RequiresChildren {
  incident?: boolean;
  required?: boolean;
  // A description displayed above the input field
  note?: string | ReactNode;
  tooltipText?: string;
  // A component displayed at the end of the label row
  endDecorator?: ReactNode;
  htmlFor?: string;
  "label-id"?: string;
}

export function ChecklistLabel(props: Readonly<ChecklistLabelProps>) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <FormLabel
            id={props["label-id"]}
            required={props.required}
            htmlFor={props.htmlFor}
            sx={{
              fontSize: 16,
              fontWeight: 700,
              display: "inline-block",
              color: (theme) =>
                props.incident === true ? theme.palette.danger[500] : undefined,
              "& .MuiFormLabel-asterisk": {
                color: (theme) =>
                  props.incident === true
                    ? theme.palette.danger[500]
                    : undefined,
              },
            }}
          >
            {props.children}
          </FormLabel>
          {isDefined(props.tooltipText) && (
            <InfoIconTooltipButton
              iconSize="md"
              infoText={props.tooltipText}
              title="Hinweis"
            />
          )}
        </Stack>
        {props.endDecorator}
      </Stack>
      {isNonNullish(props.note) && (
        <FormHelperText
          sx={{
            fontSize: 14,
            marginBlock: 0.5,
            color:
              props.incident === true
                ? theme.palette.danger[500]
                : theme.palette.text.primary,
          }}
          data-testid="checklist-label-note"
        >
          {props.note}
        </FormHelperText>
      )}
    </>
  );
}
