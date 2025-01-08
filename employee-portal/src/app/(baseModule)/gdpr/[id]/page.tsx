/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetGdprProcedureDetailsPageQuery } from "@/lib/baseModule/api/queries/gdpr";
import { GDPRProcedureDetails } from "@/lib/baseModule/components/gdpr/procedure/GDPRProcedureDetails";
import { routes } from "@/lib/baseModule/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
          personMatches={data.personMatches}
          facilityMatches={data.facilityMatches}
          linkedPersons={data.linkedCentralFilePersons}
          linkedFacilities={data.linkedCentralFileFacilities}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
