/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FacilityWebSearchForm,
  WebSearch,
} from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchForm";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
