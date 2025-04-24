/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItem } from "@eshg/base-api";
import { ActionsMenu } from "@eshg/lib-employee-portal";
import EditIcon from "@mui/icons-material/Edit";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import { Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { LowCountWarning } from "@/lib/baseModule/components/inventory/LowCountWarning";
import { inventoryItemTypeNames } from "@/lib/baseModule/components/inventory/constants";
import { LabelList } from "@/lib/baseModule/components/labels/LabelList";
import { routes } from "@/lib/baseModule/shared/routes";

function isLowAmount(data: ApiInventoryItem) {
  return (
    isDefined(data.count) &&
    isDefined(data.minCount) &&
    data.count < data.minCount
  );
}

const columnHelper = createColumnHelper<ApiInventoryItem>();

interface InventoryColumnsProps {
  onCorrection: (item: ApiInventoryItem) => void;
  onEdit: (item: ApiInventoryItem) => void;
  onRestock: (item: ApiInventoryItem) => void;
  isAdmin: boolean;
}

export function inventoryColumns({
  onCorrection,
  onEdit,
  onRestock,
  isAdmin,
}: InventoryColumnsProps) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("type", {
      header: "Typ",
      cell: (props) => inventoryItemTypeNames[props.getValue()],
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("labels", {
      header: "Labels",
      enableSorting: false,
      cell: (props) => (
        <LabelList labels={props.getValue()} maxVisible={5} disableWrap />
      ),
    }),
    columnHelper.accessor("count", {
      header: "Bestand",
      cell: (props) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <LowCountWarning visible={isLowAmount(props.row.original)} />
          {props.getValue()}
        </Stack>
      ),
      meta: {
        width: "20ch",
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Anzeigen",
              onClick: routes.inventory.details(props.row.original.id),
              startDecorator: <FullscreenIcon />,
            },
            ...(isAdmin
              ? [
                  {
                    label: "Bearbeiten",
                    onClick: () => onEdit(props.cell.row.original),
                    startDecorator: <EditIcon />,
                  },
                  {
                    label: "Lieferung",
                    onClick: () => onRestock(props.cell.row.original),
                    startDecorator: <LocalShippingIcon />,
                  },
                  {
                    label: "Inventur",
                    onClick: () => onCorrection(props.cell.row.original),
                    startDecorator: <FactCheckIcon />,
                  },
                ]
              : []),
          ]}
        />
      ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
