/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";

import { OpeningHours } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function StiProtectionConfiguratorPage() {
  return (
    <ConfiguratorLayout
      module={"stiProtection"}
      backButton={<ToolbarBackButton href={routes.stiProtection.index} />}
    >
      <OpeningHours module="stiProtection" />
    </ConfiguratorLayout>
  );
}
