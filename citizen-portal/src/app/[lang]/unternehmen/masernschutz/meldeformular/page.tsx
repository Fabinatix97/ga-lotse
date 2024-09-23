/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiReportCaseRequest } from "@eshg/citizen-portal-api/measlesProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { Box, Typography } from "@mui/joy";

import { useOrganisationPortalApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { ReportCaseForm } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import { mapAffectedPersonToApi } from "@/lib/businessModules/measlesProtection/components/reportCase/helpers";
import {
  AffectedPersonFormInputs,
  ReportMeaslesCase,
} from "@/lib/businessModules/measlesProtection/components/reportCase/types";
import { setReportCaseForm } from "@/lib/businessModules/measlesProtection/helpers/reportCaseForm.storage";
import { mapFacilityToApiAddFacilityFileStateRequest } from "@/lib/businessModules/measlesProtection/shared/facility/helpers";
import { useTranslation } from "@/lib/i18n/client";

function mapMeaslesCaseReport(report: ReportMeaslesCase): ApiReportCaseRequest {
  const apiReportCaseRequest: ApiReportCaseRequest = {
    affectedPersons: report.affectedPersons.map(
      (affectedPerson: AffectedPersonFormInputs) =>
        mapAffectedPersonToApi(affectedPerson),
    ),
    facility: mapFacilityToApiAddFacilityFileStateRequest(report.facility),
    otherFacilityTypeInformation: report.otherFacilityTypeInformation,
    type: report.facility.type || "OTHER",
  };

  return apiReportCaseRequest;
}

export default function CitizenMeaslesProtectionReportCasePage() {
  const { t } = useTranslation(["measlesProtection/base"]);
  const organisationPortalApi = useOrganisationPortalApi();
  const reportCase = useHandledMutation({
    mutationFn: async (report: ReportMeaslesCase) =>
      organisationPortalApi.report(mapMeaslesCaseReport(report)),
    onSuccess: () => {
      setReportCaseForm();
    },
  });

  async function handleSubmit(report: ReportMeaslesCase) {
    await reportCase.mutateAsync(report).catch();
  }

  return (
    <div>
      <Box sx={{ borderRadius: "xl", backgroundColor: "white", p: 2, my: 2 }}>
        <Typography
          component="h2"
          level="h2"
          sx={{ fontSize: { xxs: "1.25rem", sm: "2.25rem" } }}
        >
          {t("reportMeaslesCaseForm.pageTitle")}
        </Typography>
      </Box>
      <ReportCaseForm onSubmit={handleSubmit} />
    </div>
  );
}
