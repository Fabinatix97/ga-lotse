/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal";
import { ProstituteProtectionProvider } from "@eshg/prostitute-protection";

import { env } from "@/env/server";

export default function ProstituteProtectionLayout(props: RequiresChildren) {
  return (
    <ProstituteProtectionProvider
      baseUrl={env.PUBLIC_PROSTITUTE_PROTECTION_BACKEND_URL}
    >
      {props.children}
    </ProstituteProtectionProvider>
  );
}
