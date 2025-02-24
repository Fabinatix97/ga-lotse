/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";
import { Grid, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { AdditionalDataSection } from "./AdditionalDataSection";
import { AnonIdentityDocumentCard } from "./AnonIdentityDocumentCard";
import { AppointmentDetails } from "./AppointmentDetails";
import { CheckPinSection } from "./CheckPinSection";
import { CreateAppointmentSidebar } from "./CreateAppointmentSidebar";
import { EditPersonalDataSidebar } from "./EditPersonalDataSidebar";
import { FinalProcedureActionPanel } from "./FinalProcedureActionPanel";
import { PersonDetails } from "./PersonDetails";
import { WaitingRoomSection } from "./WaitingRoomSection";

export function ProcedureDetails({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const hasAccessCode = isDefined(procedure.person.accessCode);
  return (
    <>
      <Grid container spacing={2}>
        <Grid spacing={2} xxs={12} lg={8}>
          <Grid xxs={12} mb={2}>
            <PersonDetails procedure={procedure} />
          </Grid>
          {hasAccessCode && (
            <Grid xxs={12} mb={2}>
              <AnonIdentityDocumentCard procedure={procedure} />
            </Grid>
          )}
          <Grid xxs={12}>
            <AppointmentDetails procedure={procedure} />
          </Grid>
        </Grid>
        <Grid xxs={12} lg={4}>
          <Stack spacing={2}>
            <AdditionalDataSection procedure={procedure} />
            {hasAccessCode && <CheckPinSection procedure={procedure} />}
            <WaitingRoomSection procedure={procedure} />
            <FinalProcedureActionPanel procedure={procedure} />
          </Stack>
        </Grid>
      </Grid>
      <EditPersonalDataSidebar procedure={procedure} />
      <CreateAppointmentSidebar procedure={procedure} />
    </>
  );
}
