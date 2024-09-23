/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getSelfProcedureAsCitizenQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryCitizenApi";
import { AppointmentContent } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentContent";
import { AppointmentPageTitle } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentPageTitle";
import { AppointmentSidePanel } from "@/lib/businessModules/schoolEntry/pages/appointment/AppointmentSidePanel";
import { useDepartmentApi } from "@/lib/shared/api/clients";
import { getDepartmentInfoQuery } from "@/lib/shared/api/queries/department";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { Page } from "@/lib/shared/components/layout/page";

export default function SchoolEntryAppointmentPage() {
  const departmentApi = useDepartmentApi();
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  const [{ data: procedure }, { data: departmentInfo }] = useSuspenseQueries({
    queries: [
      getSelfProcedureAsCitizenQuery(schoolEntryCitizenApi),
      getDepartmentInfoQuery(departmentApi),
    ],
  });

  return (
    <Page>
      <AppointmentPageTitle />
      <TwoColumnGrid
        content={
          <AppointmentContent
            procedure={procedure}
            departmentInfo={departmentInfo}
          />
        }
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
    </Page>
  );
}
