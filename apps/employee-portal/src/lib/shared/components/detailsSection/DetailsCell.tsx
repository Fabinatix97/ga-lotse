/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isNonNullish, isString } from "remeda";

import { isNonEmptyString } from "@eshg/lib-portal";

export interface DetailsCellProps {
  name?: string;
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

/**
 * @deprecated This component is very old and messy. Please migrate and start using the newer DetailsItem instead of DetailsCell.
 *             The new component is based on composition and is more adaptable to situations through `slotProps`.
 *             We removed the `name` prop, to properly enforce using the labels for locators in tests.
 */
export function DetailsCellWrapped(props: DetailsCellProps) {
  return (
    <DetailsCell
      name={props.name}
      label={props.label}
      value={props.value}
      showIfEmpty={props.showIfEmpty}
      avoidWrap={props.avoidWrap}
      flexGrow={props.flexGrow}
      valueIsDiv={props.valueIsDiv}
      sx={props.sx}
      valueSx={{ overflowWrap: "anywhere", ...props.valueSx }}
    >
      {props.children}
    </DetailsCell>
  );
}

/**
 * @deprecated This component is very old and messy. Please migrate and start using the newer DetailsItem instead of DetailsCell.
 *             The new component is based on composition and is more adaptable to situations through `slotProps`.
 *             We removed the `name` prop, to properly enforce using the labels for locators in tests.
 */
export function DetailsCell({
  name: givenName,
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
  const name = givenName ?? label;

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
          level="body-sm"
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
              role="paragraph"
              component={valueIsDiv ? "div" : "p"}
              data-testid={`${name}.value`}
              level="title-md"
              sx={{
                width: avoidWrap ? "fit-content" : undefined,
                textWrap: "pretty",
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
