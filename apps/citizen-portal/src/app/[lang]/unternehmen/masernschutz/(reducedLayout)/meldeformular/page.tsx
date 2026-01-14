/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useHandledMutation } from "@eshg/lib-portal";
import { ApiReportCaseRequest } from "@eshg/measles-protection-api";

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
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageTitle } from "@/lib/shared/components/layout/page";

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
    await reportCase.mutateAsync(report);
  }

  return (
    <PageContent>
      <PageTitle>{t("reportMeaslesCaseForm.pageTitle")}</PageTitle>
      <ReportCaseForm onSubmit={handleSubmit} />
    </PageContent>
  );
}
