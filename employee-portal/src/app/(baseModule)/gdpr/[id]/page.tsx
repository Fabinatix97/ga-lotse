/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
  gdprRoutes,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { useGetGdprProcedureDetailsPageQuery } from "@/lib/baseModule/api/queries/gdpr";
import { GDPRProcedureDetails } from "@/lib/baseModule/components/gdpr/procedure/GDPRProcedureDetails";

export default function GDPRProcedurePage(
  props: DynamicPageProps<{
    id: string;
  }>,
) {
  const { id } = use(props.params);
  const { data } = useGetGdprProcedureDetailsPageQuery(id);
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="DSGVO Vorgang"
          backButton={<ToolbarBackButton href={gdprRoutes.index} />}
        />
      }
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
