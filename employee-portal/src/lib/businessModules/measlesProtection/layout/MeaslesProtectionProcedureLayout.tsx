/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  PersonToolbarHeader,
  StickyToolbarLayout,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { PropsWithChildren } from "react";

import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { CaseStatusSelect } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CaseStatusSelect";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

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
  const hasMeaslesProtectionAdminRole = useHasUserRoleCheck(
    ApiUserRole.MeaslesProtectionAdmin,
  );
  const procedure = useProcedureQuery(id).data;
  return (
    <StickyToolbarLayout
      toolbar={
        <TabNavigationToolbar
          index={navItems[0]?.href}
          header={<PersonToolbarHeader person={procedure.affectedPerson} />}
          items={navItems}
          afterTabs={<CaseStatusSelect procedure={procedure} />}
          backButton={
            hasMeaslesProtectionAdminRole ? (
              <ToolbarBackButton href={routes.procedures.index} />
            ) : null
          }
        />
      }
    >
      <MainContentLayout>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
