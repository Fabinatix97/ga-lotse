/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TabNavigationItem } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";
import {
  PlaylistAddCheckOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import { MeaslesProtectionProcedureLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionProcedureLayout";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

function createTabItems(id: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: routes.procedures.details(id).index,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Nachweisprüfung",
      href: routes.procedures.details(id).proof,
      decorator: <PlaylistAddCheckOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.details(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}

export default function Layout(props: DynamicLayoutProps<{ id: string }>) {
  const { id } = props.params;

  return (
    <MeaslesProtectionProcedureLayout id={id} navItems={createTabItems(id)}>
      {props.children}
    </MeaslesProtectionProcedureLayout>
  );
}
