/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ColorPaletteProp,
  Sheet,
  Stack,
  Table,
  Typography,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { createCountFormatter } from "@eshg/lib-employee-portal";

import { ChildForTransition } from "../../api/models/SchoolYearTransitionChildResult";

interface SchoolYearTransitionChildrenListProps {
  institutionName: string;
  info: string;
  infoColor: ColorPaletteProp;
  rows: ChildForTransition[];
}

export function SchoolYearTransitionChildrenList(
  props: SchoolYearTransitionChildrenListProps,
) {
  return (
    <Stack gap={2}>
      <Typography component="h2" level="h3">
        {props.institutionName}
      </Typography>
      <Sheet
        sx={{
          padding: 0,
        }}
      >
        <InfoTypography color={props.infoColor} fontWeight={600}>
          {props.info}
        </InfoTypography>
        <Stack gap={2} padding={3}>
          <Typography>{displayNumberOfChildren(props.rows.length)}</Typography>
          <Table stripe="even" sx={TABLE_STYLE}>
            <thead>
              <tr>
                <th role="columnheader">Vorname</th>
                <th role="columnheader">Nachname</th>
              </tr>
            </thead>
            <tbody>
              {props.rows.map((row) => {
                return (
                  <tr key={row.id}>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Stack>
      </Sheet>
    </Stack>
  );
}

const displayNumberOfChildren = createCountFormatter("Kind", "Kinder");

const InfoTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.level1,
  borderRadius: theme.radius.lg,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const TABLE_STYLE: SxProps = {
  fontSize: "md",
  "& thead th": {
    color: "var(--joy-palette-text-primary)",
  },
};
