/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, DeleteOutlined, Edit } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { ApiTextBlock } from "@eshg/inspection-api";
import {
  ActionsMenu,
  ButtonBar,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  useConfirmationDialog,
  useTableControl,
} from "@eshg/lib-employee-portal";

import { useDeleteTextBlock } from "@/lib/businessModules/inspection/api/mutations/textblocks";
import { useEditTextBlockSidebar } from "@/lib/businessModules/inspection/components/textBlock/EditTextBlockSidebar";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";

const columnHelper = createColumnHelper<ApiTextBlock>();

interface TextBlocksTableProps {
  elements: ApiTextBlock[];
  totalNumberOfElements: number;
  isFetching: boolean;
}

export function TextBlocksTable({
  elements,
  totalNumberOfElements,
  isFetching,
}: TextBlocksTableProps) {
  const deleteTextBlock = useDeleteTextBlock();
  const { openConfirmationDialog } = useConfirmationDialog();
  const sidebar = useEditTextBlockSidebar();

  function handleEdit(textBlock: ApiTextBlock) {
    sidebar.open(textBlock);
  }

  function handleAddButton() {
    handleEdit({
      id: "",
      name: "",
      content: "",
    });
  }

  function handleEditButton(textBlock: ApiTextBlock) {
    handleEdit(textBlock);
  }

  function handleDelete(textBlock: ApiTextBlock) {
    openConfirmationDialog({
      title: "Textbaustein löschen: " + textBlock.name,
      description: "Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Löschen",
      color: "danger",
      onConfirm: async () => {
        await deleteTextBlock.mutateAsync(textBlock.id ?? "");
      },
    });
  }

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  const textBlocksTableColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("content", {
      header: "Inhalt",
      enableSorting: false,
      cell: (props) => props.getValue(),
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "navigationControl",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Anpassen",
              startDecorator: <Edit />,
              onClick: () => handleEditButton(props.row.original),
            },
            {
              label: "Löschen",
              color: "danger",
              startDecorator: <DeleteOutlined />,
              onClick: () => handleDelete(props.row.original),
            },
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];

  return (
    <TablePage
      fullHeight
      data-testid="textblocks-table"
      controls={
        <ButtonBar
          left={
            <SearchFilter
              tableControl={tableControl}
              searchParamName="searchQuery"
              label="Suche"
            />
          }
          right={
            <Button
              type="submit"
              startDecorator={<Add />}
              onClick={handleAddButton}
            >
              Textbaustein hinzufügen
            </Button>
          }
        />
      }
    >
      <TableSheet
        loading={isFetching}
        footer={
          <Pagination
            totalCount={totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={elements}
          columns={textBlocksTableColumns}
          sorting={tableControl.tableSorting}
          striped
        />
      </TableSheet>
    </TablePage>
  );
}
