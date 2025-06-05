/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { ConfiguratorOverview } from "@/lib/configurator/components/overview/ConfiguratorOverview";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

export default function ConfiguratorOverviewPage(
  props: DynamicPageProps<{
    module: ConfiguratorModuleName;
  }>,
) {
  const { module } = use(props.params);

  return <ConfiguratorOverview module={module} />;
}
