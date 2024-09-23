/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiChecklistDefinitionCentralRepoMetadata } from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useState } from "react";

import {
  useDeleteCentralRepoChecklistDefinition,
  useSyncCentralRepoChecklistDefinition,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { useGetNewestChecklistDefinitionsFromCentralRepo } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { MetadataDetailsSidebar } from "@/lib/businessModules/inspection/components/repository/MetadataDetailsSidebar";
import {
  createCldRepoOverviewTableColumns,
  getRepoOverviewRowRoute,
} from "@/lib/businessModules/inspection/components/repository/overviewTableColumns";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

type UserActivityState =
  | { type: "view-table" }
  | {
      type: "view-details";
      details: ApiChecklistDefinitionCentralRepoMetadata;
    };

const INITIAL_USER_ACTIVITY: UserActivityState = { type: "view-table" };

export function ChecklistDefinitionRepoOverviewTable() {
  const { data: repoMetadataList, isFetching } =
    useGetNewestChecklistDefinitionsFromCentralRepo();
  const { openCancelDialog } = useConfirmationDialog();
  const [canEditCoreCld, canEditCld, canDeleteCld] = useHasUserRolesCheck([
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCentralrepositoryDelete,
  ]);
  const snackbar = useSnackbar();
  const [userActivity, setUserActivity] = useState<UserActivityState>(
    INITIAL_USER_ACTIVITY,
  );
  const { mutateAsync: syncCentralRepoChecklistDefinition } =
    useSyncCentralRepoChecklistDefinition();
  const { mutateAsync: deleteCentralRepoChecklistDefinition } =
    useDeleteCentralRepoChecklistDefinition();

  function handleSidebarClosed() {
    setUserActivity(INITIAL_USER_ACTIVITY);
  }

  function handleDetailsButtonClick(
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) {
    setUserActivity({ type: "view-details", details: metadata });
  }

  async function handleDownloadButtonClick(
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) {
    await syncCentralRepoChecklistDefinition(
      {
        centralRepoId: metadata.centralRepoId,
        centralRepoVersion: metadata.version,
        isCoreChecklist: metadata.isCoreChecklist,
      },
      {
        onSuccess: () =>
          snackbar.confirmation("Checkliste erfolgreich übernommen"),
      },
    );
  }

  async function handleRefreshButtonClick(
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) {
    await syncCentralRepoChecklistDefinition(
      {
        centralRepoId: metadata.centralRepoId,
        centralRepoVersion: metadata.version,
        isCoreChecklist: metadata.isCoreChecklist,
      },
      {
        onSuccess: () =>
          snackbar.confirmation("Checkliste erfolgreich aktualisiert"),
      },
    );
  }

  function handleDeleteButtonClick(
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) {
    async function handleConfirm() {
      await deleteCentralRepoChecklistDefinition({
        isCoreChecklist: metadata.isCoreChecklist,
        repositoryID: metadata.centralRepoId,
      });
    }

    openCancelDialog({
      title: "Gesamte Checkliste löschen?",
      description:
        "Möchten Sie die Checkliste mit allen Versionen wirklich löschen?",
      confirmLabel: "Löschen",
      onConfirm: handleConfirm,
    });
  }

  const columns = createCldRepoOverviewTableColumns({
    canEditCld,
    canEditCoreCld,
    canDeleteCld,
    handleDetailsButtonClick,
    handleDownloadButtonClick,
    handleRefreshButtonClick,
    handleDeleteButtonClick,
  });

  return (
    <>
      <TablePage fullHeight>
        <TableSheet loading={isFetching}>
          <DataTable
            data={repoMetadataList}
            columns={columns}
            rowNavRoute={getRepoOverviewRowRoute}
            focusColumnHeader={"Name"}
            striped
          />
        </TableSheet>
      </TablePage>
      <MetadataDetailsSidebar
        open={userActivity.type === "view-details"}
        metadata={
          userActivity.type === "view-details"
            ? userActivity.details
            : undefined
        }
        onClose={handleSidebarClosed}
      />
    </>
  );
}
