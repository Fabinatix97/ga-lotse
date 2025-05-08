/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, List, ListItem, Stack, Typography } from "@mui/joy";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { TOOTH_DIAGNOSES } from "../../translations/examination";

export function useFindingsOverviewSidebar(): UseSidebarResult {
  return useSidebar({
    component: FindingsOverviewSidebar,
  });
}

function FindingsOverviewSidebar({ onClose }: DrawerProps) {
  return (
    <>
      <SidebarContent title="Mögliche Befundwerte">
        <List size="sm" aria-label="Abkürzungsverzeichnis">
          {Object.entries(TOOTH_DIAGNOSES).map(([abbr, expl]) => (
            <ListItem key={abbr}>
              <Diagnosis
                key={abbr}
                abbreviation={abbr as Abbreviation}
                explanation={expl}
              />
            </ListItem>
          ))}
        </List>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              key="close"
              color="neutral"
              variant="soft"
              onClick={() => onClose()}
            >
              Schließen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}

type Abbreviation = keyof typeof TOOTH_DIAGNOSES;
type Explanation = (typeof TOOTH_DIAGNOSES)[keyof typeof TOOTH_DIAGNOSES];

interface DiagnosisProp {
  abbreviation: Abbreviation;
  explanation: Explanation;
}

function Diagnosis({ abbreviation, explanation }: DiagnosisProp) {
  return (
    <Stack direction="row" gap={1}>
      <Typography
        component="span"
        level="title-md"
        sx={{ fontWeight: 600, width: 24 }}
      >
        {abbreviation}
      </Typography>
      <Typography component="span" level="body-md">
        = {explanation}
      </Typography>
    </Stack>
  );
}
