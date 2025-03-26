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
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";

import { ConfiguratorStatus } from "@/lib/configuration/api/models/configurationTabItem";
import { routes } from "@/lib/configuration/shared/routes";

interface ConfigurationLayoutProps extends RequiresChildren {
  status: ConfiguratorStatus;
  module: keyof typeof routes;
}

export function ConfigurationLayout(props: ConfigurationLayoutProps) {
  const moduleNameToText: Record<ConfigurationLayoutProps["module"], string> = {
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

function TabItemErrorDecorator() {
  return <ErrorOutlineOutlined color="danger" />;
}

function TabItemWarningDecorator() {
  return <ErrorOutlineOutlined color="warning" />;
}

function TabItemSuccessDecorator() {
  return <CheckCircleOutlineOutlined color="success" />;
}

// todo: need to use
export function configurationTabItemDecorator(status: ConfiguratorStatus) {
  switch (status) {
    case "complete":
      return <TabItemSuccessDecorator />;
    case "error":
      return <TabItemErrorDecorator />;
    case "warning":
      return <TabItemWarningDecorator />;
  }
}
