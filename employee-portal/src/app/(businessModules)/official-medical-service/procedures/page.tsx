/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal/types/pageParams";

import { CreateProcedure } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/CreateProcedure";
import { ProceduresOverviewTable } from "@/lib/businessModules/officialMedicalService/components/procedures/overview/ProceduresOverviewTable";

export default function OfficialMedicalServiceProceduresPage(props: PageProps) {
  const searchParams = props.searchParams;

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
