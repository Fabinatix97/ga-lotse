/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import {
  ConfiguratorModuleName,
  configuratorNameMapping,
} from "@/lib/configurator/api/models/configuratorModuleName";

interface ConfiguratorLayoutProps extends RequiresChildren {
  module: ConfiguratorModuleName;
  backHref?: string;
}

export function ConfiguratorLayout(props: ConfiguratorLayoutProps) {
  function mapModuleNameToText() {
    if (props.module === "baseModule") {
      return configuratorNameMapping[props.module];
    }
    return `Modul „${configuratorNameMapping[props.module]}”`;
  }

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`GA-Konfigurator: ${mapModuleNameToText()}`}
          backHref={props.backHref}
        />
      }
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
