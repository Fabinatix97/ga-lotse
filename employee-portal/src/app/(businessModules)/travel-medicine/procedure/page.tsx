/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { VaccinationConsultationsOverviewTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationsOverviewTable";

export default function VaccinationConsultationsOverviewPage(
  props: DynamicPageProps<never, { date: string }>,
) {
  const searchParams = props.searchParams;

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Impfberatung" />}>
      <MainContentLayout>
        <VaccinationConsultationsOverviewTable date={searchParams.date} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
