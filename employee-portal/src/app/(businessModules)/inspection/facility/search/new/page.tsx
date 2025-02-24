/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import {
  FacilityWebSearchForm,
  WebSearch,
} from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchForm";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewFacilityWebSearchPage() {
  const initialValues: WebSearch = {
    name: "OSM Frankfurt",
    basicURL:
      "https://download.geofabrik.de/europe/germany/hessen-latest.osm.pbf",
    searchCity: "Frankfurt am Main",
  };

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.facilities.webSearch.index}
          title="Neue Web-Suche anlegen"
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <FacilityWebSearchForm initialValues={initialValues} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
