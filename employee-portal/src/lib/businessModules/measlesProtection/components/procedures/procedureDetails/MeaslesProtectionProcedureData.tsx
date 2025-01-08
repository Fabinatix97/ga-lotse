/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiReportingReason } from "@eshg/employee-portal-api/measlesProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { Grid, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import {
  reportingReasonNames,
  roleStatusNames,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { AffectedPerson } from "./AffectedPerson";
import { Custodians } from "./Custodians";
import { Facility } from "./Facility";
import { UpdateProcedureForm } from "./helpers";

export function MeaslesProtectionProcedureData({ id }: { id: string }) {
  const procedure = useProcedureQuery(id).data;
  const router = useRouter();

  useEffect(() => {
    if (procedure.procedureStatus === "DRAFT") {
      router.replace(routes.procedures.draft(procedure.id));
    }
  }, [procedure.id, procedure.procedureStatus, router]);
  if (
    procedure.procedureStatus === "DRAFT" ||
    procedure.type != "MeaslesProtectionProcedure"
  ) {
    return null;
  }

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
