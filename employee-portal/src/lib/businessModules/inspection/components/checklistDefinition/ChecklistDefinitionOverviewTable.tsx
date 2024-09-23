/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import {
  ApiChecklistDefinition,
  ApiChecklistDefinitionVersion,
} from "@eshg/employee-portal-api/inspection";
import {
  Close,
  CloudSync,
  CloudUpload,
  Edit,
  Hexagon,
  History,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { CellContext, Row, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isNonNullish, isNullish } from "remeda";

import { useGetChecklistDefinitions } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { ChecklistVersionsSidebar } from "@/lib/businessModules/inspection/components/checklistDefinition/sidebars/ChecklistVersionsSidebar";
import { UploadChecklistToRepoSidebar } from "@/lib/businessModules/inspection/components/checklistDefinition/sidebars/UploadChecklistToRepoSidebar";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

const columnHelper = createColumnHelper<ApiChecklistDefinition>();

type UserActivityState =
  | { type: "view-table" }
  | { type: "view-history"; checklistDefinitionId: string }
  | {
      type: "upload-cld-to-repo";
      checklistDefinition?: ApiChecklistDefinition;
      create: boolean;
    };

const initialUserActivity: UserActivityState = { type: "view-table" };

export function ChecklistDefinitionOverviewTable() {
  const [
    canEditCoreChecklists,
    canUploadRepoChecklists,
    canUploadRepoCoreChecklists,
    canEditChecklists,
  ] = useHasUserRolesCheck([
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
    ApiUserRole.InspectionCentralrepositoryWrite,
    ApiUserRole.InspectionCentralrepositoryWriteCorechecklists,
    ApiUserRole.InspectionChecklistdefinitionsWrite,
  ]);

  const { data: checklists, isFetching } = useGetChecklistDefinitions();

  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  function handleHistoryButtonClick(defId: string) {
    setUserActivity({
      type: "view-history",
      checklistDefinitionId: defId,
    });
  }

  function handleUploadRepoButtonClick(def: ApiChecklistDefinition) {
    setUserActivity({
      type: "upload-cld-to-repo",
      checklistDefinition: def,
      create: true,
    });
  }

  function handleUpdateRepoButtonClick(def: ApiChecklistDefinition) {
    setUserActivity({
      type: "upload-cld-to-repo",
      checklistDefinition: def,
      create: false,
    });
  }

  function handleSidebarClosed() {
    setUserActivity(initialUserActivity);
  }

  function versionsCellRenderFunction(
    props: CellContext<ApiChecklistDefinition, ApiChecklistDefinitionVersion[]>,
  ): string {
    let repoVersionString = "";
    if (isNonNullish(props.row.original.mostRecentRepositoryVersion)) {
      repoVersionString = `R${props.row.original.mostRecentRepositoryVersion.toString()}-`;
    }
    return (
      repoVersionString + props.row.original.mostRecentVersionNr.toString()
    );
  }

  function showUploadRepoMenuEntry(def: ApiChecklistDefinition): boolean {
    if (isNonNullish(def.mostRecentRepositoryVersion)) {
      return false;
    }
    if (!def.coreChecklist) {
      return canUploadRepoChecklists;
    } else {
      return canUploadRepoCoreChecklists;
    }
  }

  function showUpdateRepoMenuEntry(def: ApiChecklistDefinition): boolean {
    if (
      isNullish(def.mostRecentRepositoryVersion) ||
      def.mostRecentVersionBasedOnRepo === def.mostRecentVersionNr
    ) {
      return false;
    }
    if (!def.coreChecklist) {
      return canUploadRepoChecklists;
    } else {
      return canUploadRepoCoreChecklists;
    }
  }

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <Stack direction="row" spacing={0.5}>
          {info.row.original.coreChecklist && (
            <Hexagon
              aria-hidden={false}
              titleAccess="Kerncheckliste"
              aria-label="Kerncheckliste"
            />
          )}
          {info.renderValue()}
        </Stack>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 406,
      },
    }),
    columnHelper.accessor("versions", {
      header: "Version",
      cell: versionsCellRenderFunction,
      sortingFn: (colA, colB) => {
        return (
          (colA.original.mostRecentRepositoryVersion ?? 0) -
            (colB.original.mostRecentRepositoryVersion ?? 0) ||
          colA.original.mostRecentVersionNr - colB.original.mostRecentVersionNr
        );
      },
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("objectType.name", {
      header: "Objekttyp",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 406,
      },
    }),
    columnHelper.accessor("deleted", {
      header: "Gelöscht",
      cell: (info) => (
        <>
          {info.row.original.deleted && (
            <Close
              aria-hidden={false}
              titleAccess="Gelöscht"
              aria-label="Gelöscht"
            />
          )}
        </>
      ),
      meta: {
        width: 65,
      },
    }),
    columnHelper.accessor("mostRecentVersionId", {
      header: "Aktionen",
      enableSorting: false,
      cell: (info) => {
        const checklistRow = info.row.original;
        const hideEdit =
          !canEditChecklists ||
          (checklistRow.coreChecklist && !canEditCoreChecklists);
        return (
          <ActionsMenu
            actionItems={[
              ...(hideEdit
                ? []
                : [
                    {
                      label: "Anpassen",
                      onClick: routes.checklists.definitions.newVersion(
                        checklistRow.id,
                        checklistRow.mostRecentVersionId,
                      ),
                      startDecorator: <Edit />,
                    },
                  ]),
              {
                label: "Historie",
                onClick: () => {
                  handleHistoryButtonClick(checklistRow.id);
                },
                startDecorator: <History />,
              },
              ...(showUploadRepoMenuEntry(checklistRow)
                ? [
                    {
                      label: "Bereitstellen",
                      onClick: () => {
                        handleUploadRepoButtonClick(checklistRow);
                      },
                      startDecorator: <CloudUpload />,
                    },
                  ]
                : []),
              ...(showUpdateRepoMenuEntry(checklistRow)
                ? [
                    {
                      label: "Aktualisieren",
                      onClick: () => {
                        handleUpdateRepoButtonClick(checklistRow);
                      },
                      startDecorator: <CloudSync />,
                    },
                  ]
                : []),
            ]}
          />
        );
      },
      meta: {
        width: 96,
      },
    }),
  ];

  return (
    <>
      <TablePage fullHeight>
        <TableSheet loading={isFetching}>
          <DataTable
            data={checklists}
            columns={columns}
            rowNavRoute={getRowRoute}
            focusColumnHeader={"Name"}
            striped
          />
        </TableSheet>
      </TablePage>

      {userActivity.type === "view-history" && (
        <ChecklistVersionsSidebar
          open
          onClose={handleSidebarClosed}
          checklistDefinitionId={userActivity.checklistDefinitionId}
        />
      )}

      {userActivity.type === "upload-cld-to-repo" && (
        <UploadChecklistToRepoSidebar
          open
          onClose={handleSidebarClosed}
          checklistDefinition={userActivity.checklistDefinition}
          create={userActivity.create}
        />
      )}
    </>
  );
}

function getRowRoute(row: Row<ApiChecklistDefinition>) {
  return routes.checklists.definitions.viewVersion(
    row.original.id,
    row.original.mostRecentVersionId,
  );
}
