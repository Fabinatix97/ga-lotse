/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { Fragment } from "react";

import { isNonEmptyString } from "@eshg/lib-portal";

import { Filter } from "@/lib/components/table/Filter";
import { Header } from "@/lib/components/table/head/Header";
import { TOGGLE_EXPAND_ID } from "@/lib/helpers/addFeatureColumns";
import { OverridableEntity, UniqueEntity } from "@/lib/helpers/entities";
import { useTranslation } from "@/lib/i18n/client";

interface TableHeadProps<TData> {
  enableColumnHeaders: boolean;
  reactTable: TanstackTable<TData>;
  enableColumnFilter: boolean;
}

export function TableHead<
  TData extends UniqueEntity & OverridableEntity<TData>,
>(props: TableHeadProps<TData>) {
  const { t } = useTranslation();

  return (
    props.enableColumnHeaders && (
      <thead>
        {props.reactTable.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const column = header.column;
              const columnDef = column.columnDef;
              const meta = columnDef.meta;
              return (
                <Fragment key={column.id}>
                  <Header
                    key={header.id}
                    canSort={column.getCanSort()}
                    isSorted={column.getIsSorted()}
                    label={
                      isNonEmptyString(columnDef.header)
                        ? t(columnDef.header)
                        : meta?.headerLabel
                    }
                    id={column.id}
                    onSort={column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      isNonEmptyString(columnDef.header)
                        ? t(columnDef.header, columnDef.header)
                        : columnDef.header,
                      header.getContext(),
                    )}
                  </Header>
                </Fragment>
              );
            })}
          </tr>
        ))}
        {props.enableColumnFilter &&
          props.reactTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Box
                    key={header.column.id}
                    component="th"
                    role={
                      header.column.id != TOGGLE_EXPAND_ID ? undefined : "none"
                    }
                    sx={{ maxWidth: "0" }}
                  >
                    <Filter table={props.reactTable} column={header.column} />
                  </Box>
                );
              })}
            </tr>
          ))}
      </thead>
    )
  );
}
