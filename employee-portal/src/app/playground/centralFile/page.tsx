/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

import { centralFilePlaygroundRoutes } from "@/app/playground/centralFile/centralFilePlaygroundRoutes";

export default function PersonEditFlowsPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={"Person edit flows playground"} />}
    >
      <MainContentLayout>
        <ul>
          <li>
            <InternalLink href={centralFilePlaygroundRoutes.acceptUpdate.index}>
              Accept update from central file
            </InternalLink>
          </li>
        </ul>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
