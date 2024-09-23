/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PropsWithChildren } from "react";

import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { CaseStatusSelect } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CaseStatusSelect";
import { MeaslesProtectionTabHeader } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionTabHeader";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

export interface MeaslesProtectionProcedurePageParams
  extends PropsWithChildren {
  id: string;
  navItems: TabNavigationItem[];
}

export function MeaslesProtectionProcedureLayout({
  children,
  navItems,
  id,
}: MeaslesProtectionProcedurePageParams) {
  const procedure = useProcedureQuery(id).data;
  return (
    <StickyToolbarLayout
      toolbar={
        <TabNavigationToolbar
          items={navItems}
          routeBack={routes.procedures.index}
          header={
            <MeaslesProtectionTabHeader person={procedure.affectedPerson} />
          }
          index={navItems[0]?.href}
          afterTabs={<CaseStatusSelect procedure={procedure} />}
        />
      }
    >
      <MainContentLayout>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
