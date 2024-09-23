/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
