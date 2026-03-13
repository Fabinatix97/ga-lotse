/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { DeviceRegistry } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/DeviceRegistry";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { resolveConfiguratorRoute } from "@/lib/configurator/shared/routes";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

export default function DeviceRegistryConfiguratorPage(
  props: DynamicPageProps<{
    module: ConfiguratorModuleName;
  }>,
) {
  const { module } = use(props.params);

  return (
    <ConfiguratorLayout
      module={module}
      backButton={
        <ToolbarBackButton
          href={resolveConfiguratorRoute({ module, endpointName: "index" })}
        />
      }
    >
      <DeviceRegistry module={module} />
    </ConfiguratorLayout>
  );
}
