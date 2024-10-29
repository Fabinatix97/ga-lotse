/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Grid, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isNonNullish, isString } from "remeda";

export interface DetailsCellProps {
  name: string;
  label: string;
  value?: string | number | ReactNode;
  showIfEmpty?: boolean;
  children?: ReactNode;
  avoidWrap?: boolean;
  flexGrow?: boolean;
  valueIsDiv?: boolean;
  sx?: SxProps;
  valueSx?: SxProps;
}

export function DetailsCell({
  name,
  label,
  value,
  children,
  showIfEmpty,
  avoidWrap,
  flexGrow,
  valueIsDiv,
  sx,
  valueSx,
}: DetailsCellProps) {
  const isRenderableValue =
    isNonNullish(value) && (!isString(value) || isNonEmptyString(value));
  const isRenderable =
    isRenderableValue || showIfEmpty === true || isNonNullish(children);

  return (
    isRenderable && (
      <Stack
        direction="column"
        gap={0.25}
        sx={{
          flex: flexGrow ? "1 0" : undefined,
          ...sx,
        }}
      >
        <Typography
          data-testid={`${name}.label`}
          level={"body-sm"}
          textColor="text.secondary"
          noWrap
          sx={{
            width: "fit-content",
            maxWidth: "100%",
          }}
          aria-label={label}
        >
          {label}
        </Typography>
        <Grid container alignItems="center">
          {isRenderableValue ? (
            <Typography
              role={"paragraph"}
              component={valueIsDiv ? "div" : "p"}
              data-testid={`${name}.value`}
              level="title-md"
              sx={{
                width: avoidWrap ? "fit-content" : undefined,
                textWrap: "balance",
                hyphens: "auto",
                ...valueSx,
              }}
            >
              {value}
            </Typography>
          ) : (
            showIfEmpty && (
              <Typography
                data-testid={`${name}.value`}
                component="i"
                color="neutral"
                level="title-md"
              >
                Keine Angaben
              </Typography>
            )
          )}
          {children}
        </Grid>
      </Stack>
    )
  );
}
