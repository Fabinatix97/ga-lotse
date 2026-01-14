/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ContentPanel,
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { NavigationLink } from "@eshg/lib-portal";

import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";

export default function Offline() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Offline" />}>
      <MainContentLayout>
        <ContentPanel>
          <NavigationLink href={inspectionRoutes.procedures.index}>
            Begehungsvorgänge
          </NavigationLink>
        </ContentPanel>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
