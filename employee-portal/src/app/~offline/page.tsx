/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";

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
