/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ArrowForward } from "@mui/icons-material";
import {
  Box,
  ColorPaletteProp,
  List,
  ListDivider,
  ListItem,
  Sheet,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { FC } from "react";

import { NO_GROUP } from "../../api/models/SchoolYearTransitionGroupResult";

import { GroupView } from "./GroupView";

interface SchoolYearTransitionGroupListProps {
  institutionName?: string;
  info: string;
  infoColor: ColorPaletteProp;
  rows: (string | undefined)[];
  nextYearAction?: boolean;
  targetGroupComponent: FC<{ row?: string; rowIndex: number }>;
}

export function SchoolYearTransitionGroupList(
  props: SchoolYearTransitionGroupListProps,
) {
  const TargetGroupComponent = props.targetGroupComponent;
  return (
    <Stack gap={2}>
      {props.institutionName && (
        <Typography component="h2" level="h3">
          {props.institutionName}
        </Typography>
      )}
      <Sheet
        sx={{
          padding: 0,
        }}
      >
        <InfoTypography color={props.infoColor} fontWeight={600}>
          {props.info}
        </InfoTypography>
        <GroupList>
          {props.rows.map((row, rowIndex) => (
            <Box key={row ?? NO_GROUP} sx={{ display: "contents" }}>
              <GroupListItem key={row}>
                <GroupView row={row} />
                <ArrowForward />
                <TargetGroupComponent row={row} rowIndex={rowIndex} />
              </GroupListItem>
              {rowIndex < props.rows.length - 1 && (
                <ListDivider inset="gutter" />
              )}
            </Box>
          ))}
        </GroupList>
      </Sheet>
    </Stack>
  );
}

const GroupList = styled(List)(({ theme }) => ({
  "--ListItem-paddingY": theme.spacing(3),
  "--ListItem-paddingX": theme.spacing(3),
  "--ListDivider-gap": 0,
}));

const GroupListItem = styled(ListItem)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const InfoTypography = styled(Typography)(({ theme, color }) => ({
  padding: theme.spacing(3),
  backgroundColor:
    color === "warning"
      ? theme.palette.warning[100]
      : theme.palette.background.level1,
  color: color === "warning" ? theme.palette.text.primary : undefined,
  borderRadius: theme.radius.lg,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));
