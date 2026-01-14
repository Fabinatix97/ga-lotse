/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { AccessibilityStatement } from "@/lib/configurator/components/shared/ConfiguratorDetails/AccessibilityStatement";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { resolveConfiguratorRoute } from "@/lib/configurator/shared/routes";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

export default function PrivacyNoticeConfiguratorPage(
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
      <AccessibilityStatement module={module} />
    </ConfiguratorLayout>
  );
}
