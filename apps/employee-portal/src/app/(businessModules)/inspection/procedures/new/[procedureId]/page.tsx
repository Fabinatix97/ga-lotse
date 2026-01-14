/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useInspectionApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import {
  getObjectTypesHierarchyTreeQuery,
  getObjectTypesQuery,
} from "@/lib/businessModules/inspection/api/queries/objectTypes";
import {
  getAllAssignableUsersQuery,
  getSelfUserQuery,
} from "@/lib/businessModules/inspection/api/queries/users";
import { AddInspectionTiles } from "@/lib/businessModules/inspection/components/inspection/new/AddInspectionTiles";

export default function NewInspectionProcedurePage(
  props: DynamicPageProps<{ procedureId: string }>,
) {
  const { procedureId } = use(props.params);
  const inspectionApi = useInspectionApi();
  const objectTypeApi = useObjectTypeApi();
  const userApi = useUserApi();

  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

  const [
    { data: inspection },
    { data: objectTypesHierarchyTree },
    { data: objectTypes },
    { data: selfUser },
    { data: allAssignableUsers },
  ] = useSuspenseQueries({
    queries: [
      getInspectionQuery(inspectionApi, procedureId),
      getObjectTypesHierarchyTreeQuery(objectTypeApi),
      getObjectTypesQuery(objectTypeApi),
      getSelfUserQuery(userApi),
      getAllAssignableUsersQuery(userApi),
    ],
  });

  return (
    <AddInspectionTiles
      inspection={inspection}
      objectTypes={
        featureToggleEnabled ? objectTypesHierarchyTree : objectTypes
      }
      selfUser={selfUser}
      allAssignableUsers={allAssignableUsers}
    />
  );
}
