/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { styled } from "@mui/joy";
import { ReactNode } from "react";

const StyledTable = styled("table")(({ theme }) => ({
  width: "fit-content",
  "th, td": {
    textAlign: "left",
  },
  th: {
    minWidth: 150,
    fontWeight: theme.fontWeight.md,
    padding: theme.spacing(0.5, 1, 0.5, 0),
  },
  td: {
    padding: theme.spacing(0.5, 1, 0.5, 1),
  },
}));

interface DetailsTableRow {
  label: string;
  value: string | ReactNode;
}

interface DetailsTableProps {
  data: DetailsTableRow[];
}

export function DetailsTable(props: DetailsTableProps) {
  return (
    <StyledTable>
      <tbody>
        {props.data.map((row) => (
          <tr key={row.label}>
            <th>{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}
