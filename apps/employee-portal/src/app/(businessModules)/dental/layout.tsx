/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalProvider } from "@eshg/dental";
import { SidebarScope } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

import { env } from "@/env/server";

export default function DentalLayout(props: RequiresChildren) {
  return (
    <DentalProvider baseUrl={env.PUBLIC_DENTAL_BACKEND_URL}>
      <SidebarScope>{props.children}</SidebarScope>
    </DentalProvider>
  );
}
