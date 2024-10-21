/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import { Sheet, Typography, styled } from "@mui/joy";
import { PropsWithChildren, ReactElement } from "react";

export function DetailsCard({
  title,
  fullHeight,
  children,
  actionButton,
}: PropsWithChildren<{
  title: string;
  fullHeight?: boolean;
  actionButton?: ReactElement;
}>) {
  return (
    <Sheet
      component="section"
      sx={{ padding: 3, height: fullHeight ? "100%" : "auto" }}
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
