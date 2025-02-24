/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { useGetGdprProcedureDetailsPageQuery } from "@/lib/baseModule/api/queries/gdpr";
import { GDPRProcedureDetails } from "@/lib/baseModule/components/gdpr/procedure/GDPRProcedureDetails";
import { routes } from "@/lib/baseModule/shared/routes";

export default function GDPRProcedurePage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const { data } = useGetGdprProcedureDetailsPageQuery(params.id);
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="DSGVO Vorgang" backHref={routes.gdpr.index} />}
    >
      <MainContentLayout>
        <GDPRProcedureDetails
          procedure={data.procedure}
          hasDownload={data.hasCentralFileDownload}
          personMatches={data.personMatches}
          facilityMatches={data.facilityMatches}
          linkedPersons={data.linkedCentralFilePersons}
          linkedFacilities={data.linkedCentralFileFacilities}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
