/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useInspectionApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { getObjectTypesQuery } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import {
  getAllAssignableUsersQuery,
  getSelfUserQuery,
} from "@/lib/businessModules/inspection/api/queries/users";
import { AddInspectionTiles } from "@/lib/businessModules/inspection/components/inspection/new/AddInspectionTiles";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewInspectionProcedurePage({
  params,
}: Readonly<{
  params: { procedureId: string };
}>) {
  const inspectionApi = useInspectionApi();
  const objectTypeApi = useObjectTypeApi();
  const userApi = useUserApi();

  const [
    { data: inspection },
    { data: objectTypes },
    { data: selfUser },
    { data: allAssignableUsers },
  ] = useSuspenseQueries({
    queries: [
      getInspectionQuery(inspectionApi, params.procedureId),
      getObjectTypesQuery(objectTypeApi),
      getSelfUserQuery(userApi),
      getAllAssignableUsersQuery(userApi),
    ],
  });

  const facility = inspection.facility;

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.procedures.index}
          title={facility.baseFacility.name}
        />
      }
    >
      <MainContentLayout>
        <AddInspectionTiles
          inspection={inspection}
          objectTypes={objectTypes}
          selfUser={selfUser}
          allAssignableUsers={allAssignableUsers}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
