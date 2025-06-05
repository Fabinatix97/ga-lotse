/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

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
          title="Neue Web-Suche anlegen"
          backButton={
            <ToolbarBackButton href={routes.facilities.webSearch.index} />
          }
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <FacilityWebSearchForm initialValues={initialValues} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
