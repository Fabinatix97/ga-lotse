/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

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

export default function NewInspectionProcedurePage(
  props: DynamicPageProps<{ procedureId: string }>,
) {
  const { procedureId } = use(props.params);
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
      getInspectionQuery(inspectionApi, procedureId),
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
          title={facility.baseFacility.name}
          backButton={<ToolbarBackButton href={routes.procedures.index} />}
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
