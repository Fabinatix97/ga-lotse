/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Box, Table as JoyTable, Typography, useTheme } from "@mui/joy";

interface DecayHistoryTableProps {
  title: string;
  valueColumnName: string;
  rows: DecayTableValue[];
}

export function DecayHistoryTable(props: DecayHistoryTableProps) {
  const theme = useTheme();
  return (
    <>
      <Typography component="h3" sx={{ marginBottom: 2 }}>
        {props.title}
      </Typography>
      <JoyTable>
        <thead>
          <tr>
            <th role="columnheader">{props.valueColumnName}</th>
            <th role="columnheader">Datum</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, index) => {
            const rowStyle = row.showWarning
              ? { backgroundColor: theme.palette.danger.outlinedActiveBg }
              : {};
            return (
              <Box component="tr" key={index} sx={rowStyle}>
                <td>{row.decayValue}</td>
                <td>{formatDate(row.date)}</td>
              </Box>
            );
          })}
        </tbody>
      </JoyTable>
    </>
  );
}

export interface DecayTableValue {
  date: Date;
  decayValue: string;
  showWarning: boolean;
}
