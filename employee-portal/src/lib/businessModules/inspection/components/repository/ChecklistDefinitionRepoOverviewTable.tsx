/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { ApiChecklistDefinitionCentralRepoMetadata } from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useDeleteCentralRepoChecklistDefinition,
  useSyncCentralRepoChecklistDefinition,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { useGetNewestChecklistDefinitionsFromCentralRepo } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { useMetadataDetailsSidebar } from "@/lib/businessModules/inspection/components/repository/MetadataDetailsSidebar";
import {
  createCldRepoOverviewTableColumns,
  getRepoOverviewRowRoute,
} from "@/lib/businessModules/inspection/components/repository/overviewTableColumns";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

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
  const metadataDetailsSidebar = useMetadataDetailsSidebar();
  const { mutateAsync: syncCentralRepoChecklistDefinition } =
    useSyncCentralRepoChecklistDefinition();
  const { mutateAsync: deleteCentralRepoChecklistDefinition } =
    useDeleteCentralRepoChecklistDefinition();

  function handleDetailsButtonClick(
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) {
    metadataDetailsSidebar.open({
      metadata,
    });
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
            rowNavigation={{
              route: getRepoOverviewRowRoute,
              focusColumnAccessorKey: "name",
            }}
            striped
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
