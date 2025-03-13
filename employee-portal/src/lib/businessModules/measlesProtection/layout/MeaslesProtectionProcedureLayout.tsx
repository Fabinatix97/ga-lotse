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
          items={navItems}
          routeBack={
            hasMeaslesProtectionAdminRole ? routes.procedures.index : undefined
          }
          header={<PersonToolbarHeader person={procedure.affectedPerson} />}
          index={navItems[0]?.href}
          afterTabs={<CaseStatusSelect procedure={procedure} />}
        />
      }
    >
      <MainContentLayout>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
