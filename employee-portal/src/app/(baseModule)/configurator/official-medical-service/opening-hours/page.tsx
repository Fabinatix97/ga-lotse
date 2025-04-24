/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";

import { OpeningHours } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function OfficialMedicalServiceConfiguratorPage() {
  return (
    <ConfiguratorLayout
      module={"officialMedicalService"}
      backButton={
        <ToolbarBackButton href={routes.officialMedicalService.index} />
      }
    >
      <OpeningHours module="officialMedicalService" />
    </ConfiguratorLayout>
  );
}
