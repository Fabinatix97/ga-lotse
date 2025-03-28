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

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";

interface ConfiguratorLayoutProps extends RequiresChildren {
  status: ConfiguratorStatus;
  module: ConfiguratorModuleName;
}

export function ConfiguratorLayout(props: ConfiguratorLayoutProps) {
  const moduleNameToText: Record<ConfiguratorLayoutProps["module"], string> = {
    baseModule: "Grundmodul",
    schoolEntry: "Modul „Einschulung”",
    travelMedicine: "Modul „Impfberatung”",
    measlesProtection: "Modul „Masernschutz”",
    medicalRegistry: "Modul „Medizinalaufsicht”",
    stiProtection: "Modul „HIV-STI-Beratung”",
    sexWork: "Modul „Sexarbeit”",
  };

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar title={`GA-Konfigurator: ${moduleNameToText[props.module]}`} />
      }
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
