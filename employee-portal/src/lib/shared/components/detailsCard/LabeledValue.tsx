/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { Stack, Typography, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useId } from "react";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";

export const ValueList = styled("div")<{ rowLayout?: boolean }>(
  ({ theme, rowLayout }) => ({
    display: "flex",
    flexDirection: rowLayout ? "row" : "column",
    flexWrap: "wrap",
    gap: rowLayout ? theme.spacing(3) : theme.spacing(1),
    flexBasis: rowLayout ? "auto" : theme.spacing(50),
    overflow: "hidden",

    [theme.breakpoints.down("xs")]: {
      flexBasis: "auto",
      flexDirection: "column",
      marginLeft: 0,
      paddingLeft: 0,
      marginTop: theme.spacing(4),
      paddingTop: theme.spacing(4),
      borderLeft: "none",
      borderTop: "1px solid #636b744d",
    },
  }),
);

export function LabeledValue({
  label,
  value,
  href,
  sx,
}: {
  label: string;
  value: string | undefined;
  href?: string;
  sx?: SxProps;
}) {
  const labelId = useId();

  if (!value) {
    return undefined;
  }

  const blankTabAttrs = href?.startsWith("mailto:")
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};
  const content =
    href && value ? (
      <InternalLink
        display="block"
        sx={{
          ...multiLineEllipsis(1),
        }}
        href={href}
        {...blankTabAttrs}
      >
        {value}
      </InternalLink>
    ) : (
      value
    );

  return (
    <Stack sx={sx}>
      <Typography
        id={labelId}
        fontWeight={500}
        level="body-xs"
        sx={{ color: "text.secondary", overflow: "hidden", textWrap: "nowrap" }}
      >
        {label}
      </Typography>
      <Typography
        level="title-md"
        fontWeight={600}
        aria-labelledby={labelId}
        title={value}
        sx={{
          ...multiLineEllipsis(1),
        }}
      >
        {content}
      </Typography>
    </Stack>
  );
}
