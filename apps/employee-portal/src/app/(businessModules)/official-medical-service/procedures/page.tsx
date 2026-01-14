/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal";

import { CreateProcedure } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/CreateProcedure";
import { ProceduresOverviewTable } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/ProceduresOverviewTable";

export default async function OfficialMedicalServiceProceduresPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Amtsärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ProceduresOverviewTable
          buttons={[<CreateProcedure key="createProcedure" />]}
          filter={searchParams}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
