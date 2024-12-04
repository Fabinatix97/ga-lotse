/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Box, Button } from "@mui/joy";

import {
  GeoShapeInfo,
  mapSortKey,
} from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { useActivateGeoShape } from "@/lib/businessModules/statistics/api/mutations/useActivateGeoShape";
import { useArchiveGeoShape } from "@/lib/businessModules/statistics/api/mutations/useArchiveGeoShape";
import { useDeleteGeoShape } from "@/lib/businessModules/statistics/api/mutations/useDeleteGeoShape";
import { useGetGeoShapes } from "@/lib/businessModules/statistics/api/queries/useGetGeoShapes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";

import { geoShapeTableColumns } from "./columns";

function ImportGeoShapesButton({ onClick }: { onClick: () => void }) {
  return (
    <Button startDecorator={<FileUploadOutlinedIcon />} onClick={onClick}>
      Geo-Shapes importieren
    </Button>
  );
}

export interface GeoShapesTableProps {
  onImportGeoShapesClick: () => void;
}

export function GeoShapesTable({
  onImportGeoShapesClick,
}: GeoShapesTableProps) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const archiveGeoShape = useArchiveGeoShape();
  const activateGeoShape = useActivateGeoShape();
  const deleteGeoShape = useDeleteGeoShape();

  function archiveGeoShapeWithConfirmation(geoShape: GeoShapeInfo) {
    openConfirmationDialog({
      title: `„${geoShape.title}” archivieren?`,
      description:
        "Die Karte steht dann bei der Diagramm-Erstellung nicht mehr zur Verfügung.",
      confirmLabel: "Archivieren",
      onConfirm: () => archiveGeoShape(geoShape.id),
      color: "danger",
      children: (
        <Alert
          title=""
          message="Diagramme, die bereits die Karte verwenden, werden weiterhin angezeigt."
          color="primary"
        />
      ),
    });
  }

  function activateGeoShapeWithConfirmation(id: string) {
    openConfirmationDialog({
      title: "Archivierung aufheben?",
      description: "Die Karte kann danach in den Diagrammen ausgewählt werden.",
      confirmLabel: "Aufheben",
      onConfirm: () => activateGeoShape(id),
    });
  }

  function deleteGeoShapeWithConfirmation(geoShape: GeoShapeInfo) {
    openConfirmationDialog({
      title: `„${geoShape.title}” löschen?`,
      description: "Die Geo-Shapes werden dann unwiderruflich gelöscht.",
      confirmLabel: "Löschen",
      onConfirm: () => deleteGeoShape(geoShape.id),
      color: "danger",
    });
  }

  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const { sortKey, sortDirection, manualSortingProps } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: {
      id: "createdAt",
      desc: true,
    },
  });

  const { geoShapes, totalNumberOfElements } = useGetGeoShapes({
    page,
    pageSize,
    sortKey: mapSortKey(sortKey),
    sortDirection,
  });

  return (
    <TablePage
      data-testid="geo-shapes-table"
      fullHeight
      controls={
        <ButtonBar
          right={<ImportGeoShapesButton onClick={onImportGeoShapesClick} />}
        />
      }
    >
      <TableSheet
        footer={
          <Pagination
            {...getPaginationProps({ totalCount: totalNumberOfElements })}
          />
        }
      >
        <DataTable
          data={geoShapes}
          columns={geoShapeTableColumns(
            archiveGeoShapeWithConfirmation,
            activateGeoShapeWithConfirmation,
            deleteGeoShapeWithConfirmation,
          )}
          sorting={manualSortingProps}
          noDataComponent={() => (
            <Box flex={1} alignContent="center">
              <NoSearchResults
                info="Keine Geo-Shapes vorhanden"
                buttonLabel="Geo-Shapes importieren"
                onClick={onImportGeoShapesClick}
                decorator={<FileUploadOutlinedIcon />}
              />
            </Box>
          )}
          enableSortingRemoval={false}
        />
      </TableSheet>
    </TablePage>
  );
}
