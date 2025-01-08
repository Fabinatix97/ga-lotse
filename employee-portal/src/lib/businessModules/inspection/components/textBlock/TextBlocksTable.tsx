/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTextBlock } from "@eshg/employee-portal-api/inspection";
import { Add, DeleteOutlined, Edit } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { useDeleteTextBlock } from "@/lib/businessModules/inspection/api/mutations/textblocks";
import { EditTextBlockSidebar } from "@/lib/businessModules/inspection/components/textBlock/EditTextBlockSidebar";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

const columnHelper = createColumnHelper<ApiTextBlock>();

interface TextBlocksTableProps {
  elements: ApiTextBlock[];
  totalNumberOfElements: number;
  isFetching: boolean;
}

interface TextBlockTableState {
  open: boolean;
  textBlock: ApiTextBlock;
}

export function TextBlocksTable({
  elements,
  totalNumberOfElements,
  isFetching,
}: TextBlocksTableProps) {
  const deleteTextBlock = useDeleteTextBlock();
  const { openConfirmationDialog } = useConfirmationDialog();

  const [state, setState] = useState<TextBlockTableState>({
    open: false,
    textBlock: {
      id: "",
      name: "",
      content: "",
    },
  });

  function handleEdit(textBlock: ApiTextBlock) {
    setState({
      open: true,
      textBlock,
    });
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

  function handleClose() {
    setState((prev) => ({
      ...prev,
      open: false,
    }));
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
    <>
      <TablePage
        fullHeight
        data-testid="textblocks-table"
        controls={
          <ButtonBar
            left={
              <SearchFilter
                tableControl={tableControl}
                searchParamName={"searchQuery"}
                label={"Suche"}
              />
            }
            right={
              <Button
                type={"submit"}
                onClick={handleAddButton}
                startDecorator={<Add />}
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
      <EditTextBlockSidebar
        onClose={handleClose}
        open={state.open}
        {...state.textBlock}
      />
    </>
  );
}
