/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Grid, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import { PageGrid, StatisticsInclusionPanel } from "@eshg/lib-employee-portal";
import { useControlledAlert } from "@eshg/lib-portal";
import {
  ApiLocationSelectionMode,
  ApiStatisticsInclusion,
} from "@eshg/school-entry-api";

import { useProcedureApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { ProcedureDetails as ProcedureDetailsType } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { AddCustodianPanel } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/AddCustodianPanel";
import { ProcedureActionsPanel } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureActionsPanel";
import { ProcedureDetailsSection } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ProcedureDetailsSection";
import { WaitingRoomPanel } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/WaitingRoomPanel";

import { PersonDetailsPanel } from "./PersonDetailsPanel";

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

const STATISTICS_INCLUDE_NAMES = {
  [ApiStatisticsInclusion.Include]: "Ja",
  [ApiStatisticsInclusion.Custom]: "Nur Mitarbeiterstatistik",
  [ApiStatisticsInclusion.Exclude]: "Nein",
};

const STATISTICS_INCLUDE_READ_ONLY_NAMES = {
  [ApiStatisticsInclusion.Include]:
    "Der Vorgang wird in Auswertungen berücksichtigt.",
  [ApiStatisticsInclusion.Custom]:
    "Der Vorgang wird nur für die Mitarbeiterstatistik berücksichtigt.",
  [ApiStatisticsInclusion.Exclude]: "Der Vorgang wird nicht berücksichtigt.",
};

interface ProcedureDetailsProps {
  procedure: ProcedureDetailsType;
  locationSelectionMode: ApiLocationSelectionMode;
}

export function ProcedureDetails(props: ProcedureDetailsProps) {
  const { procedure, locationSelectionMode } = props;

  const procedureApi = useProcedureApi();

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
    <Box role="tabpanel">
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
                key={custodian.fileStateId}
                isCustodian
                title={`${index + 1}. PSB - Personensorgeberechtigte:r`}
                person={custodian}
                procedure={procedure}
                name={`custodian-details-${index}`}
              />
            ))}
            {!procedure.isClosed && <AddCustodianPanel procedure={procedure} />}
          </Stack>
        </Grid>
        <Grid xs={4}>
          <Stack spacing={SPACING}>
            <ProcedureDetailsSection procedure={procedure} />
            <ProcedureActionsPanel procedure={procedure} />
            <StatisticsInclusionPanel
              procedure={procedure}
              writeRole={ApiUserRole.SchoolEntryLeader}
              procedureStatisticsClient={procedureApi}
              statisticsInclusionDisplayValues={STATISTICS_INCLUDE_NAMES}
              statisticsInclusionDisplayReadOnlyValues={
                STATISTICS_INCLUDE_READ_ONLY_NAMES
              }
            />
            {locationSelectionMode === ApiLocationSelectionMode.None &&
              !procedure.isClosed &&
              isDefined(procedure.appointment) && (
                <WaitingRoomPanel procedure={procedure} />
              )}
          </Stack>
        </Grid>
      </PageGrid>
    </Box>
  );
}
