/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { Acknowledgements } from "@/lib/baseModule/components/acknowledgements/Acknowledgements";

export default function AcknowledgementsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Danksagung"} />}>
      <MainContentLayout>
        <Acknowledgements />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
