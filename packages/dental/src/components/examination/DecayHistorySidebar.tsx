/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Stack } from "@mui/joy";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
} from "@eshg/lib-employee-portal";

import { Dentition } from "../../stores/examination/types";
import {
  calculateDecayRisk,
  calculateDecayStatus,
} from "../../utils/examination";

import { DecayHistoryRow, DecayHistoryTable } from "./DecayHistoryTable";

export interface DecayHistoryItem {
  dentition: Dentition;
  dateOfExamination: Date;
}

interface DecayHistorySidebarProps extends DrawerProps {
  historyItems: DecayHistoryItem[];
  dateOfBirth: Date;
}

export function DecayHistorySidebar(props: DecayHistorySidebarProps) {
  const decayRiskRows: DecayHistoryRow[] = props.historyItems.map((result) =>
    calculateDecayRisk(result, props.dateOfBirth),
  );
  const decayStatusRows: DecayHistoryRow[] =
    props.historyItems.map(calculateDecayStatus);

  return (
    <>
      <SidebarContent title="Historie automatisierter Werte">
        <Stack gap={3}>
          <DecayHistoryTable
            title="Kariesrisiko"
            valueColumnName="Risiko"
            rows={decayRiskRows}
          />
          <DecayHistoryTable
            title="Kariesstatus"
            valueColumnName="Status"
            rows={decayStatusRows}
          />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              key="close"
              color="neutral"
              variant="soft"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}
