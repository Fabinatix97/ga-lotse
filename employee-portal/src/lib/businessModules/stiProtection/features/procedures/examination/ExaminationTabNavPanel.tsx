/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BiotechOutlined } from "@mui/icons-material";
import { Box, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { LaboratoryTestOutlined } from "@/lib/shared/components/icons/LaboratoryTestOutlined";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelNav } from "@/lib/shared/components/sidePanel/SidePanelNav";
import { SidePanelNavLink } from "@/lib/shared/components/sidePanel/SidePanelNavLink";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

function buildNavItems(procedureId: string): NavItem[] {
  return [
    {
      name: "Schnelltests",
      href: routes.procedures.byId(procedureId).rapidTest,
      icon: <LaboratoryTestOutlined />,
    },
    {
      name: "Labortests",
      href: routes.procedures.byId(procedureId).laboratoryTest,
      icon: <BiotechOutlined />,
    },
  ];
}

export function ExaminationTabNavPanel(
  params: StiProtectionProcedurePageParams,
) {
  const navItems = buildNavItems(params.id);

  return (
    <Stack gap={3}>
      <SidePanel>
        <SidePanelTitle component={"h3"} fontSize={"1.25rem"}>
          Untersuchungen
        </SidePanelTitle>
        <SidePanelNav>
          {navItems.map((navItem) => (
            <SidePanelNavLink href={navItem.href} key={navItem.name}>
              <Stack direction="row" alignItems={"center"} gap={2}>
                <Box display={"flex"} justifyContent={"center"}>
                  {navItem.icon}
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                  {navItem.name}
                </Box>
              </Stack>
            </SidePanelNavLink>
          ))}
        </SidePanelNav>
      </SidePanel>
    </Stack>
  );
}
