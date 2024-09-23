/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Typography, styled } from "@mui/joy";
import { PropsWithChildren, ReactElement } from "react";

import { Row } from "@/lib/shared/Row";

export function DetailCard({
  title,
  fullHeight,
  children,
  "data-testid": dataTestId,
  actionButton,
}: PropsWithChildren<{ title: string; fullHeight?: boolean }> & {
  "data-testid"?: string;
  actionButton?: ReactElement;
}) {
  return (
    <Sheet
      component="section"
      sx={{ padding: 3, height: fullHeight ? "100%" : "auto" }}
      data-testid={dataTestId}
    >
      <Row marginBottom={3} minHeight={36} justifyContent="space-between">
        <Typography
          component="h2"
          fontWeight="600"
          textOverflow="ellipsis"
          fontSize="20px"
          noWrap
          level="body-md"
        >
          {title}
        </Typography>
        {actionButton}
      </Row>
      <DetailSections>{children}</DetailSections>
    </Sheet>
  );
}
const DetailSections = styled("div")`
  display: flex;
  & > * {
    margin-left: ${({ theme }) => theme.spacing(4)};
    padding-left: ${({ theme }) => theme.spacing(4)};
    border-left: 1px solid #636b744d;
  }
  & > *:first-child {
    margin: 0;
    padding: 0;
    border: none;
  }
  ${({ theme }) => theme.breakpoints.down("xs")} {
    flex-direction: column;
    flex-basis: auto;
  }
`;
