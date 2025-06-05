/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

import { configuratorNameMapping } from "@/lib/configurator/components/shared/configuratorNameMapping";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

interface ConfiguratorLayoutProps extends RequiresChildren {
  module: ConfiguratorModuleName;
  backButton?: ReactNode;
}

export function ConfiguratorLayout(props: ConfiguratorLayoutProps) {
  function mapModuleNameToText() {
    if (props.module === "BASE") {
      return configuratorNameMapping[props.module];
    }
    return `Modul „${configuratorNameMapping[props.module]}”`;
  }

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`GA-Konfigurator: ${mapModuleNameToText()}`}
          backButton={props.backButton}
        />
      }
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
