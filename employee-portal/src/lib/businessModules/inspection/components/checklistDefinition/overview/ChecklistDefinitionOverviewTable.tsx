/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiChecklistDefinition } from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useAddChecklistDefinitionVersion,
  useEditDraftChecklistDefinitionVersion,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { generateChecklistDefinitionOverviewTableColumns } from "@/lib/businessModules/inspection/components/checklistDefinition/overview/columns";
import { UploadChecklistToRepoSidebar } from "@/lib/businessModules/inspection/components/checklistDefinition/sidebars/UploadChecklistToRepoSidebar";
import { ChecklistVersionsSidebar } from "@/lib/businessModules/inspection/components/checklistDefinition/sidebars/history/ChecklistVersionsSidebar";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

type UserActivityState =
  | { type: "view-table" }
  | {
      type: "view-history";
      checklistDefinition: ApiChecklistDefinition;
    }
  | {
      type: "upload-cld-to-repo";
      checklistDefinition?: ApiChecklistDefinition;
      create: boolean;
    };

const initialUserActivity: UserActivityState = { type: "view-table" };

interface ChecklistDefinitionOverviewTableProps {
  checklists: ApiChecklistDefinition[];
  isFetching: boolean;
}

export function ChecklistDefinitionOverviewTable({
  checklists,
  isFetching,
}: Readonly<ChecklistDefinitionOverviewTableProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();
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

  const { mutateAsync: addCldVersion } = useAddChecklistDefinitionVersion();
  const { mutateAsync: editDraftCldVersion } =
    useEditDraftChecklistDefinitionVersion();
  const router = useRouter();

  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  function handleHistoryButtonClick(def: ApiChecklistDefinition) {
    setUserActivity({
      type: "view-history",
      checklistDefinition: def,
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

  const columns = generateChecklistDefinitionOverviewTableColumns(
    snackbar,
    router,
    {
      canEditCoreChecklists,
      canUploadRepoChecklists,
      canUploadRepoCoreChecklists,
      canEditChecklists,
    },
    {
      openConfirmationDialog,
      handleHistoryButtonClick,
      handleUploadRepoButtonClick,
      handleUpdateRepoButtonClick,
      addCldVersion,
      editDraftCldVersion,
    },
  );

  function onRowClick(row: Row<ApiChecklistDefinition>): string {
    const def = row.original;
    if (!def.mostRecentVersion.context.published) {
      return (def.coreChecklist && canEditCoreChecklists) ||
        (!def.coreChecklist && canEditChecklists)
        ? routes.checklists.definitions.newVersion(
            row.original.id,
            row.original.mostRecentVersion.context.id,
          )
        : routes.checklists.definitions.viewVersion(
            row.original.id,
            row.original.mostRecentVersion.context.id,
          );
    }
    return routes.checklists.definitions.viewVersion(
      row.original.id,
      row.original.mostRecentVersion.context.id,
    );
  }

  return (
    <>
      <TablePage fullHeight>
        <TableSheet loading={isFetching}>
          <DataTable
            data={checklists}
            columns={columns}
            rowNavRoute={onRowClick}
            focusColumnHeader={"Name"}
            striped
          />
        </TableSheet>
      </TablePage>

      {userActivity.type === "view-history" && (
        <ChecklistVersionsSidebar
          open
          onClose={handleSidebarClosed}
          checklistDefinition={userActivity.checklistDefinition}
          onUploadCldClick={() =>
            handleUploadRepoButtonClick(userActivity.checklistDefinition)
          }
          onUpdateCldClick={() =>
            handleUpdateRepoButtonClick(userActivity.checklistDefinition)
          }
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
