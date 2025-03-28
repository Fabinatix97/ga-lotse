/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
} from "@eshg/lib-employee-portal";
import { Button, Stack } from "@mui/joy";

import {
  DecayHistoryRow,
  DecayHistoryTable,
} from "@/lib/businessModules/dental/features/examinations/DecayHistoryTable";
import {
  calculateDecayRisk,
  calculateDecayStatus,
} from "@/lib/businessModules/dental/features/examinations/decayCalculations";
import { Dentition } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

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
              color="neutral"
              variant="soft"
              key="close"
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
