/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiLocationSelectionMode } from "@eshg/employee-portal-api/schoolEntry";
import { useControlledAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Grid, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { ProcedureDetails as ProcedureDetailsType } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { AddCustodianPanel } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/AddCustodianPanel";
import { ProcedureActionsPanel } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureActionsPanel";
import { ProcedureDetailsSection } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureDetailsSection";
import { WaitingRoomPanel } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/WaitingRoomPanel";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";

import { PersonDetailsPanel } from "./PersonDetailsPanel";

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

interface ProcedureDetailsProps {
  procedure: ProcedureDetailsType;
  locationSelectionMode: ApiLocationSelectionMode;
}

export function ProcedureDetails(props: ProcedureDetailsProps) {
  const { procedure, locationSelectionMode } = props;

  useControlledAlert({
    type: "error",
    open: procedure.hasInformationBlock,
    message: "Für diesen Vorgang wurde eine Auskunftssperre erteilt.",
  });

  useControlledAlert({
    type: "notification",
    open: procedure.isPastProcedure,
    message: "Dieser Vorgang wurde aus dem Altdatenbestand importiert.",
  });

  return (
    <PageGrid>
      <Grid xs={8}>
        <Stack spacing={SPACING}>
          <PersonDetailsPanel
            title="Kind"
            person={procedure.child}
            procedure={procedure}
            name="child-details"
          />
          {procedure.custodians.map((custodian, index) => (
            <PersonDetailsPanel
              canDelete
              title={`${index + 1}. PSB - Personensorgeberechtigte:r`}
              person={custodian}
              procedure={procedure}
              name={`custodian-details-${index}`}
              key={custodian.fileStateId}
            />
          ))}
          {!procedure.isClosed && <AddCustodianPanel procedure={procedure} />}
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={SPACING}>
          <ProcedureDetailsSection procedure={procedure} />
          <ProcedureActionsPanel procedure={procedure} />
          {locationSelectionMode === ApiLocationSelectionMode.None &&
            !procedure.isClosed &&
            isDefined(procedure.appointment) && (
              <WaitingRoomPanel procedure={procedure} />
            )}
        </Stack>
      </Grid>
    </PageGrid>
  );
}
