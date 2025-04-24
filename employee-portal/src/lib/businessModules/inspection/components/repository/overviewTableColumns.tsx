/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChecklistDefinitionCentralRepoMetadata } from "@eshg/inspection-api";
import { ActionsMenu } from "@eshg/lib-employee-portal";
import {
  Close,
  DeleteOutlined,
  Done,
  Download,
  DownloadDone,
  MenuBook,
  Sync,
  SyncProblem,
} from "@mui/icons-material";
import { ColorPaletteProp, Stack } from "@mui/joy";
import { CellContext, Row, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { CorechecklistIcon } from "@/lib/businessModules/inspection/components/icons/CorechecklistIcon";
import {
  isCurrentVersion as _isCurrentVersion,
  isNewVersion as _isNewVersion,
  isUpdateableVersion as _isUpdateableVersion,
} from "@/lib/businessModules/inspection/components/repository/utils";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

const columnHelper =
  createColumnHelper<ApiChecklistDefinitionCentralRepoMetadata>();

export interface CldRepoOverviewTableColumnsProps {
  canEditCoreCld: boolean;
  canEditCld: boolean;
  canDeleteCld: boolean;
  handleDetailsButtonClick: (
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) => void;
  handleDownloadButtonClick: (
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) => Promise<void>;
  handleRefreshButtonClick: (
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) => Promise<void>;
  handleDeleteButtonClick: (
    metadata: ApiChecklistDefinitionCentralRepoMetadata,
  ) => void;
}

export function createCldRepoOverviewTableColumns(
  props: CldRepoOverviewTableColumnsProps,
) {
  return [
    // TODO: column widths are still undecided
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {info.row.original.isCoreChecklist && (
            <CorechecklistIcon
              size="sm"
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
    columnHelper.accessor("version", {
      header: "Version",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("objectType", {
      header: "Objekttyp",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 406,
      },
    }),
    columnHelper.accessor("origin", {
      header: "Herkunft",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 220,
      },
    }),
    columnHelper.accessor("localCldRepoVersion", {
      header: "Status",
      cell: localCldRepoVersionCellRenderFunction,
      sortingFn: localCldRepoVersionSortingFunction,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 70,
      },
    }),
    columnHelper.accessor("isExpandable", {
      header: "Erweiterbar",
      cell: isExpandableCellRenderFunction,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 70,
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      enableSorting: false,
      cell: (info) => actionsRenderFunction({ ...info }, props),
      meta: {
        width: 96,
      },
    }),
  ];
}

function isCurrentVersion({
  version,
  localCldRepoVersion,
}: ApiChecklistDefinitionCentralRepoMetadata) {
  return _isCurrentVersion(version, localCldRepoVersion);
}
function isUpdateableVersion({
  localCldRepoVersion,
  version,
}: ApiChecklistDefinitionCentralRepoMetadata) {
  return _isUpdateableVersion(version, localCldRepoVersion);
}
function isNewVersion({
  localCldRepoVersion,
}: ApiChecklistDefinitionCentralRepoMetadata) {
  return _isNewVersion(localCldRepoVersion);
}

function localCldRepoVersionCellRenderFunction({
  row,
}: CellContext<ApiChecklistDefinitionCentralRepoMetadata, number>): ReactNode {
  return (
    <Stack direction="row">
      {isCurrentVersion(row.original) && (
        <DownloadDone
          aria-hidden={false}
          titleAccess="Aktuell"
          aria-label="Aktuell"
        />
      )}
      {isUpdateableVersion(row.original) && (
        <SyncProblem
          aria-hidden={false}
          titleAccess="Aktualisierbar"
          aria-label="Aktualisierbar"
        />
      )}
      {isNewVersion(row.original) && (
        <Download
          aria-hidden={false}
          titleAccess="Übernehmbar"
          aria-label="Übernehmbar"
        />
      )}
    </Stack>
  );
}

function localCldRepoVersionSortingFunction(
  { original: colA }: Row<ApiChecklistDefinitionCentralRepoMetadata>,
  { original: colB }: Row<ApiChecklistDefinitionCentralRepoMetadata>,
) {
  /*
         | A/B   | New_A | Upd_A | Cur_A |
         | New_B |   0   |   1   |   1   |
         | Upd_B |  -1   |   0   |   1   |
         | Cur_B |  -1   |  -1   |   0   |
         */
  if (
    (isNewVersion(colA) && isNewVersion(colB)) ||
    (isUpdateableVersion(colA) && isUpdateableVersion(colB)) ||
    (isCurrentVersion(colA) && isCurrentVersion(colB))
  ) {
    return 0;
  }
  if (isNewVersion(colA)) {
    return -1;
  }
  if (isNewVersion(colB)) {
    return 1;
  }
  if (isCurrentVersion(colA) && isUpdateableVersion(colB)) {
    return 1;
  }
  if (isUpdateableVersion(colA) && isCurrentVersion(colB)) {
    return -1;
  }
  return 0; // unreachable
}

function isExpandableCellRenderFunction({
  row,
}: CellContext<ApiChecklistDefinitionCentralRepoMetadata, boolean>): ReactNode {
  return (
    <Stack direction="row">
      {row.original.isExpandable && (
        <Done
          aria-hidden={false}
          titleAccess="Erweiterbar"
          aria-label="Erweiterbar"
        />
      )}
      {!row.original.isExpandable && (
        <Close
          aria-hidden={false}
          titleAccess="Nicht erweiterbar"
          aria-label="Nicht erweiterbar"
        />
      )}
    </Stack>
  );
}

function actionsRenderFunction(
  {
    row: { original: metadata },
  }: CellContext<ApiChecklistDefinitionCentralRepoMetadata, unknown>,
  {
    canEditCoreCld,
    canEditCld,
    canDeleteCld,
    handleDetailsButtonClick,
    handleDownloadButtonClick,
    handleRefreshButtonClick,
    handleDeleteButtonClick,
  }: CldRepoOverviewTableColumnsProps,
): ReactNode {
  const isCoreChecklist = metadata.isCoreChecklist;
  const canEdit = isCoreChecklist ? canEditCoreCld : canEditCld;
  return (
    <ActionsMenu
      actionItems={[
        {
          label: "Details",
          onClick: () => handleDetailsButtonClick(metadata),
          startDecorator: <MenuBook />,
        },
        ...(canEdit && isNewVersion(metadata)
          ? [
              {
                label: "Übernehmen",
                onClick: () => handleDownloadButtonClick(metadata),
                startDecorator: <Download />,
              },
            ]
          : []),
        ...(canEdit && isUpdateableVersion(metadata)
          ? [
              {
                label: "Aktualisieren",
                onClick: () => handleRefreshButtonClick(metadata),
                startDecorator: <Sync />,
              },
            ]
          : []),
        ...(canDeleteCld
          ? [
              {
                label: "Löschen",
                onClick: () => handleDeleteButtonClick(metadata),
                color: "danger" as ColorPaletteProp,
                startDecorator: <DeleteOutlined />,
              },
            ]
          : []),
      ]}
    />
  );
}

export function getRepoOverviewRowRoute(
  row: Row<ApiChecklistDefinitionCentralRepoMetadata>,
) {
  return row.original.isCoreChecklist
    ? routes.repository.definitions.viewCoreCldVersion(
        row.original.centralRepoId,
        row.original.version,
      )
    : routes.repository.definitions.viewCldVersion(
        row.original.centralRepoId,
        row.original.version,
      );
}
