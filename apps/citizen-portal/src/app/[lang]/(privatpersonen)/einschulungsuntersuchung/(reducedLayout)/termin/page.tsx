/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getSelfProcedureAsCitizenQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryCitizenApi";
import { AppointmentContent } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentContent";
import { AppointmentPageTitle } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentPageTitle";
import { AppointmentSidePanel } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentSidePanel";
import { usePublicDepartmentApi } from "@/lib/shared/api/clients";
import { getDepartmentInfoQuery } from "@/lib/shared/api/queries/department";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

export default function SchoolEntryAppointmentPage() {
  const departmentApi = usePublicDepartmentApi();
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  const [{ data: procedure }, { data: departmentInfo }] = useSuspenseQueries({
    queries: [
      getSelfProcedureAsCitizenQuery(schoolEntryCitizenApi),
      getDepartmentInfoQuery(departmentApi),
    ],
  });

  return (
    <PageContent>
      <AppointmentPageTitle />
      <TwoColumnGrid
        content={<AppointmentContent procedure={procedure} />}
        sidePanel={
          <AppointmentSidePanel
            isClosed={procedure.isClosedProcedure}
            appointmentChangesByCitizenLeft={
              procedure.appointmentChangesByCitizenLeft
            }
            departmentPhoneNumber={departmentInfo.phoneNumber}
          />
        }
      />
    </PageContent>
  );
}
