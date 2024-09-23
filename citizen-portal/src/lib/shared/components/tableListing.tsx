/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { styled } from "@mui/joy";
import { ReactNode } from "react";

export const StyledTable = styled("table")(({ theme }) => ({
  th: {
    fontWeight: "normal",
    whiteSpace: "nowrap",
  },
  "th, td": {
    verticalAlign: "top",
    textAlign: "left",
    padding: theme.spacing(0, 0.5),
    ":first-child": {
      paddingLeft: 0,
    },
    ":last-child": {
      paddingRight: 0,
    },
  },
}));

export function TableListing(props: RequiresChildren) {
  return (
    <StyledTable>
      <tbody>{props.children}</tbody>
    </StyledTable>
  );
}

interface TableListingRowProps extends RequiresChildren {
  label: ReactNode;
}

export function TableListingRow(props: TableListingRowProps) {
  return (
    <tr>
      <th>{props.label}</th>
      <td>{props.children}</td>
    </tr>
  );
}
