/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ConfigurationTabItem } from "@/lib/configuration/api/models/configurationTabItem";
import { ConfigurationLayout } from "@/lib/configuration/components/shared/ConfigurationLayout";
import { routes } from "@/lib/configuration/shared/routes";

export default function MedicalRegistryConfigurationPage() {
  const status = "complete";
  const _tabItems: ConfigurationTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.medicalRegistry.index,
      status,
    },
  ];

  return (
    <ConfigurationLayout status={status} module={"medicalRegistry"}>
      medical-registry
    </ConfigurationLayout>
  );
}
