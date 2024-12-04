/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { Grid, Stack } from "@mui/joy";

import { AdditionalDataSection } from "./AdditionalDataSection";
import { AnonIdentityDocumentCard } from "./AnonIdentityDocumentCard";
import { AppointmentDetails } from "./AppointmentDetails";
import { CheckPinSection } from "./CheckPinSection";
import { CloseAndReopenProcedurePanel } from "./CloseProcedurePanel";
import { CreateAppointmentSidebar } from "./CreateAppointmentSidebar";
import { EditPersonalDataSidebar } from "./EditPersonalDataSidebar";
import { PersonDetails } from "./PersonDetails";
import { WaitingRoomSection } from "./WaitingRoomSection";

export function ProcedureDetails({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid spacing={2} xxs={12} lg={8}>
          <Grid xxs={12} mb={2}>
            <PersonDetails procedure={procedure} />
          </Grid>
          <Grid xxs={12} mb={2}>
            <AnonIdentityDocumentCard procedure={procedure} />
          </Grid>
          <Grid xxs={12}>
            <AppointmentDetails procedure={procedure} />
          </Grid>
        </Grid>
        <Grid xxs={12} lg={4}>
          <Stack spacing={2}>
            <AdditionalDataSection procedure={procedure} />
            <CheckPinSection procedure={procedure} />
            <WaitingRoomSection procedure={procedure} />
            <CloseAndReopenProcedurePanel procedure={procedure} />
          </Stack>
        </Grid>
      </Grid>
      <EditPersonalDataSidebar procedure={procedure} />
      <CreateAppointmentSidebar procedure={procedure} />
    </>
  );
}
