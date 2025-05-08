/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ArrowForward, ErrorOutlineOutlined } from "@mui/icons-material";
import {
  ColorPaletteProp,
  List,
  ListDivider,
  ListItem,
  Sheet,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/joy";

import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";

interface SchoolYearTransitionGroupListProps {
  institutionName: string;
  info: string;
  infoColor: ColorPaletteProp;
  rows: string[];
  nextYearAction?: boolean;
  warning?: string;
}

export function SchoolYearTransitionGroupList(
  props: SchoolYearTransitionGroupListProps,
) {
  const theme = useTheme();
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
        {props.warning && (
          <WarningTypography
            startDecorator={<ErrorOutlineOutlined color="danger" />}
          >
            {props.warning}
          </WarningTypography>
        )}
        <GroupList>
          {props.rows.map((row, rowIndex) => (
            <>
              <GroupListItem key={row}>
                <Stack>
                  <Typography textColor={theme.palette.text.secondary}>
                    Gruppe
                  </Typography>
                  <Typography fontWeight={600}>{row}</Typography>
                </Stack>
                <ArrowForward />
                {props.nextYearAction ? (
                  <TextareaField
                    name={`groupNames.${rowIndex}.targetGroupName`}
                    label="Nächstes Schuljahr"
                    minRows={1}
                    sxTextarea={{ width: 150 }}
                    required="Bitte ausfüllen"
                  />
                ) : (
                  <Typography fontWeight={600}>Schulabgang</Typography>
                )}
              </GroupListItem>
              {rowIndex < props.rows.length - 1 && (
                <ListDivider inset="gutter" />
              )}
            </>
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

const InfoTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.level1,
  borderRadius: theme.radius.lg,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const WarningTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
  color: theme.palette.danger.plainColor,
  alignItems: "flex-start",
}));
