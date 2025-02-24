/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { VaccinationConsultationsOverviewTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationsOverviewTable";

export default function VaccinationConsultationsOverviewPage(
  props: Readonly<{
    searchParams?: {
      date: string;
    };
  }>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Impfberatung" />}>
      <MainContentLayout>
        <VaccinationConsultationsOverviewTable
          date={props.searchParams?.date}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
