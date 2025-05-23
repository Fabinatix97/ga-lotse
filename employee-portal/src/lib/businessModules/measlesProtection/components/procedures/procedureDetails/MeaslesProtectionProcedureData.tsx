/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";
import assert from "assert";
import { useFormikContext } from "formik";

import { TextareaField, buildEnumOptions } from "@eshg/lib-portal";
import { ApiReportingReason } from "@eshg/measles-protection-api";

import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import {
  reportingReasonNames,
  roleStatusNames,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";

import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { AffectedPerson } from "./AffectedPerson";
import { Custodians } from "./Custodians";
import { Facility } from "./Facility";
import { UpdateProcedureForm } from "./helpers";

export function MeaslesProtectionProcedureData({ id }: { id: string }) {
  const procedure = useProcedureQuery(id).data;
  assert(procedure.type === "MeaslesProtectionProcedure");

  return (
    <Grid container spacing={3} data-testid="procedureDetailPage">
      <Grid xs={12} lg>
        <Stack gap={3}>
          <AffectedPerson procedure={procedure} />
          <Custodians procedure={procedure} />
          <Facility procedure={procedure} />
        </Stack>
      </Grid>

      <Grid xs={12} lg={4} sx={{ maxWidth: { lg: 432 } }}>
        <AdditionalInfoSection procedure={procedure} />
      </Grid>
    </Grid>
  );
}

export const roleStatuses = buildEnumOptions(roleStatusNames);
export const reasons = buildEnumOptions(reportingReasonNames);

export function OtherComment() {
  const { values } = useFormikContext<UpdateProcedureForm>();
  return values.reportData?.reportingReason === ApiReportingReason.Other ? (
    <TextareaField
      name="reportData.commentReportingReason"
      label="Kommentar zum Meldegrund"
      required="Bitte einen Kommentar angeben."
    />
  ) : null;
}
