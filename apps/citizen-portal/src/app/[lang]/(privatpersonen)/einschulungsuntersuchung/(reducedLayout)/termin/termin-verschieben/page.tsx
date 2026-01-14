/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { Alert, DisabledFormProvider } from "@eshg/lib-portal";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import {
  getSelfFreeAppointmentsAsCitizenQuery,
  getSelfProcedureAsCitizenQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryCitizenApi";
import { AppointmentPageTitle } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentPageTitle";
import { UpdateAppointmentForm } from "@/lib/businessModules/schoolEntry/pages/appointment/update-appointment/UpdateAppointmentForm";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function SchoolEntryUpdateAppointmentPage() {
  const { t } = useTranslation(["schoolEntry/appointment"]);
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  const [{ data: procedure }, { data: freeAppointments }] = useSuspenseQueries({
    queries: [
      getSelfProcedureAsCitizenQuery(schoolEntryCitizenApi),
      getSelfFreeAppointmentsAsCitizenQuery(schoolEntryCitizenApi),
    ],
  });

  return (
    <PageContent>
      <AppointmentPageTitle />
      {procedure.isClosedProcedure ? (
        <Alert
          title={t("procedureClosed.title")}
          message={t("procedureClosed.message")}
          color="warning"
        />
      ) : (
        <DisabledFormProvider disabled={procedure.isClosedProcedure}>
          <UpdateAppointmentForm
            procedure={procedure}
            freeAppointments={freeAppointments}
          />
        </DisabledFormProvider>
      )}
    </PageContent>
  );
}
