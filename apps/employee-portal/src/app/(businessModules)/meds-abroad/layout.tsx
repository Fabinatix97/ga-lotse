/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SidebarScope } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";
import { MedsAbroadProvider } from "@eshg/meds-abroad";

import { env } from "@/env/server";

export default function MedsAbroadLayout(props: RequiresChildren) {
  return (
    <MedsAbroadProvider baseUrl={env.PUBLIC_MEDS_ABROAD_BACKEND_URL}>
      <SidebarScope>{props.children}</SidebarScope>
    </MedsAbroadProvider>
  );
}
