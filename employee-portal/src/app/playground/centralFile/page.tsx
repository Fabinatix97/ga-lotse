/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

import { centralFilePlaygroundRoutes } from "@/app/playground/centralFile/centralFilePlaygroundRoutes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
