/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Circle, CircleOutlined, Error } from "@mui/icons-material";
import { List, ListItem, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";

const LegendList = styled(List)(({ theme }) => ({
  flexGrow: 0,
  flexWrap: "wrap",
  "--List-gap": theme.spacing(3),
  "--ListItem-paddingX": 0,
}));

export function FullDentitionLegend() {
  return (
    <LegendList orientation="horizontal" size="sm" aria-label="Legende">
      <ListItem>
        <LegendItem
          icon={
            <Error
              color="warning"
              aria-label="Ausrufezeichen"
              aria-hidden={false}
            />
          }
          helpText="Vorbefund vorhanden"
        />
      </ListItem>
      <ListItem>
        <LegendItem
          icon={
            <Circle
              color="neutral"
              aria-label="Ausgefüllt"
              aria-hidden={false}
            />
          }
          helpText="Bleibender Zahn"
        />
      </ListItem>
      <ListItem>
        <LegendItem
          icon={
            <CircleOutlined
              color="neutral"
              aria-label="Nicht ausgefüllt"
              aria-hidden={false}
            />
          }
          helpText="Milchzahn"
        />
      </ListItem>
      <ListItem>
        <LegendItem
          icon={
            <CircleOutlined
              color="primary"
              aria-label="Blauer Rahmen"
              aria-hidden={false}
            />
          }
          helpText="Pflichtangabe"
        />
      </ListItem>
    </LegendList>
  );
}

interface LegendItemProps {
  icon: ReactNode;
  helpText: string;
}

function LegendItem({ icon, helpText }: LegendItemProps) {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {icon}
      <Typography component="span">= {helpText}</Typography>
    </Stack>
  );
}
