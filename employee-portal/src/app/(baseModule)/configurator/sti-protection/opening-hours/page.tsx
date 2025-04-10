/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { OpeningHours } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function StiProtectionConfiguratorPage() {
  return (
    <ConfiguratorLayout
      backHref={routes.stiProtection.index}
      module={"stiProtection"}
    >
      <OpeningHours module="stiProtection" />
    </ConfiguratorLayout>
  );
}
