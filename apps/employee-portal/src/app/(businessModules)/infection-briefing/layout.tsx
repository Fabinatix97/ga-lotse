/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfectionBriefingProvider } from "@eshg/infection-briefing";
import { SidebarScope } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

import { env } from "@/env/server";

export default function InfectionBriefingLayout(props: RequiresChildren) {
  return (
    <InfectionBriefingProvider
      baseUrl={env.PUBLIC_INFECTION_BRIEFING_BACKEND_URL}
    >
      <SidebarScope>{props.children}</SidebarScope>
    </InfectionBriefingProvider>
  );
}
