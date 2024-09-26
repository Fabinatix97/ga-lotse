/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getSelfProcedureAsCitizenQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryCitizenApi";
import { CitizenAnamnesisForm } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/CitizenAnamnesisForm";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function SchoolEntrySelfAnamnesisPage() {
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  const { data: procedure } = useSuspenseQuery(
    getSelfProcedureAsCitizenQuery(schoolEntryCitizenApi),
  );

  return (
    <PageLayout>
      <PageContent>
        <CitizenAnamnesisForm child={procedure.child} />
      </PageContent>
    </PageLayout>
  );
}
