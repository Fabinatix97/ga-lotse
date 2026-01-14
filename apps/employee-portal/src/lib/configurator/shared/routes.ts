/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorEndpointName, ConfiguratorModuleName } from "./types";

export function resolveConfiguratorRoute(props: {
  module: ConfiguratorModuleName;
  endpointName: ConfiguratorEndpointName | "index";
}): string {
  if (props.endpointName === "index") {
    return `/configurator/${props.module}`;
  }
  return `/configurator/${props.module}/${props.endpointName}`;
}
