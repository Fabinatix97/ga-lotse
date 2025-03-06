/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";

import { CreateProcedure } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/CreateProcedure";
import { ProceduresOverviewTable } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/ProceduresOverviewTable";

export default function OfficialMedicalServiceProceduresPage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Amtsärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ProceduresOverviewTable
          buttons={[<CreateProcedure key="createProcedure" />]}
          filter={props.searchParams}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
