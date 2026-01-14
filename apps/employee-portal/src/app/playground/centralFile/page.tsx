/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { InternalLink } from "@eshg/lib-portal";

import { centralFilePlaygroundRoutes } from "@/app/playground/centralFile/centralFilePlaygroundRoutes";

export default function PersonEditFlowsPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Person edit flows playground" />}
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
