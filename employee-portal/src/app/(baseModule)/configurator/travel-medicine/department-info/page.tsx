/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";

import { DepartmentInfo } from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function TravelMedicineConfiguratorPage() {
  return (
    <ConfiguratorLayout
      module={"travelMedicine"}
      backButton={<ToolbarBackButton href={routes.travelMedicine.index} />}
    >
      <DepartmentInfo module="travelMedicine" />
    </ConfiguratorLayout>
  );
}
