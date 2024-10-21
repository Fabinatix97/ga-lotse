/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiWebSearchEntry } from "@eshg/employee-portal-api/inspection";
import { Add } from "@mui/icons-material";
import { Checkbox, Chip, CircularProgress, Stack } from "@mui/joy";
import { Cell, ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isDefined } from "remeda";

import { translateWebSearchStatus } from "@/lib/businessModules/inspection/shared/enums";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { SubRowColumns } from "@/lib/shared/components/table/DataTable";

const columnHelper: ColumnHelper<ApiWebSearchEntry> =
  createColumnHelper<ApiWebSearchEntry>();

interface FacilitySearchResultsColumnsOptions {
  changeIgnored: (
    entry: ApiWebSearchEntry,
    newValue: boolean,
  ) => Promise<boolean>;
  addFacility: (entry: ApiWebSearchEntry) => Promise<void> | void;
}

export function createFacilitySearchResultColumns(
  options: FacilitySearchResultsColumnsOptions,
) {
  return [
    columnHelper.accessor("status", {
      header: "Status",
      cell: (ctx) => translateWebSearchStatus(ctx.getValue()),
    }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("postalCode", { header: "PLZ" }),
    columnHelper.accessor("city", { header: "Stadt" }),
    columnHelper.display({
      header: "Adresse",
      cell: (ctx) =>
        [ctx.row.original.street, ctx.row.original.houseNumber].join(" "),
    }),
    columnHelper.accessor("ignored", {
      header: "Ignorieren",
      enableSorting: false,
      cell: (ctx) => (
        <CheckboxCell
          initialState={ctx.getValue()}
          onChange={async (newValue) =>
            await options.changeIgnored(ctx.row.original, newValue)
          }
        />
      ),
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (ctx) => {
        const canAdd = !isDefined(ctx.row.original.facilityId);
        return (
          canAdd && (
            <DropdownMenu
              onClickAdd={() => options.addFacility(ctx.row.original)}
            />
          )
        );
      },
      meta: {
        width: 96,
      },
    }),
  ];
}

export function createFacilitySearchResultSubRowColumns(): SubRowColumns<ApiWebSearchEntry> {
  return {
    postalCode: {
      renderCell: (cell: Cell<ApiWebSearchEntry, unknown>) => (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {cell.row.original.tags.map((tag) => (
            <Chip key={tag} color="primary" size="sm">
              {tag}
            </Chip>
          ))}
        </Stack>
      ),
      tdProps: {
        colSpan: 4,
      },
    },
    // don't display these 3 following columns because "postalCode" has a colspan of 4
    city: { skip: true },
    Adresse: { skip: true },
    ignored: { skip: true },
  };
}

function DropdownMenu(props: { onClickAdd: () => void }) {
  return (
    <ActionsMenu
      actionItems={[
        {
          label: "Zu Stammdaten hinzufügen...",
          onClick: props.onClickAdd,
          startDecorator: <Add />,
        },
      ]}
    />
  );
}

function CheckboxCell(props: {
  initialState: boolean;
  onChange: (newValue: boolean) => Promise<boolean>;
}) {
  const [value, setValue] = useState(props.initialState);
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    setLoading(true);
    const newValue = !value;
    try {
      const changedValue = await props.onChange(newValue);
      setValue(changedValue);
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <CircularProgress aria-label="Lädt" size="sm" />
  ) : (
    <Checkbox onChange={handleChange} checked={value} />
  );
}
