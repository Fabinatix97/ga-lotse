/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";

import { DepartmentInfo } from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function SexWorkConfiguratorPage() {
  return (
    <ConfiguratorLayout
      module={"sexWork"}
      backButton={<ToolbarBackButton href={routes.sexWork.index} />}
    >
      <DepartmentInfo module="sexWork" />
    </ConfiguratorLayout>
  );
}
