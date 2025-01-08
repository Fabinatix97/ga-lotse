/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Box from "@mui/joy/Box";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  FilterFnOption,
  Row,
  Table,
  Updater,
} from "@tanstack/react-table";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  isArray,
  isEmpty,
  isFunction,
  isNullish,
  isObjectType,
  isString,
  unique,
} from "remeda";

import { MultiSelectFilter } from "@/lib/components/table/MultiSelectFilter";
import { SelectOption } from "@/lib/components/table/SelectOptions";
import { SingleSelectFilter } from "@/lib/components/table/SingleSelectFilter";
import { TextInputFilter } from "@/lib/components/table/TextInputFilter";
import {
  EDIT_BUTTON_ID,
  HeaderButtons,
} from "@/lib/components/table/addEditColumns";
import { getActiveLabel } from "@/lib/components/table/cell/ActiveCell";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { UniqueEntity } from "@/lib/helpers/entities";
import { entityToString } from "@/lib/helpers/entityToString";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";
import { Rule } from "@/lib/hooks/useRules";

export function toColumnFilter<TData, TValue>(
  searchParams: ReadonlyURLSearchParams,
): (columnDef: ColumnDef<TData, TValue>) => ColumnFiltersState {
  return (columnDef: ColumnDef<TData, TValue>) => {
    const stringToValue =
      columnDef.meta?.stringToValue ?? ((value: string) => value as TValue);
    if (!columnDef.id) {
      return [];
    }
    if (columnDef.meta?.multiFilter) {
      const value = searchParams.getAll(columnDef.id).map(stringToValue);
      if (isEmpty(value)) {
        return [];
      }
      return [
        {
          id: columnDef.id,
          value: value,
        },
      ];
    }
    const value = searchParams.get(columnDef.id);
    if (value == null) {
      return [];
    }
    return [
      {
        id: columnDef.id,
        value: stringToValue(value),
      },
    ];
  };
}

export function toStringOrArrayOfString(value: unknown): string | string[] {
  if (isArray(value)) {
    return value.map((v) => String(v));
  }
  return String(value);
}

export function Filter<TData extends UniqueEntity, TValue>({
  table,
  column,
}: Readonly<{
  table: Table<TData>;
  column: Column<TData, TValue>;
}>) {
  function getOtherLabel(column: Readonly<Column<TData, TValue>>) {
    return column.id === "actors"
      ? (value: TValue) =>
          isEntity(value) ? entityToString(value) : String(value)
      : (value: TValue) => String(value);
  }

  if (column.id === EDIT_BUTTON_ID) {
    return <HeaderButtons table={table} />;
  }

  if (!column.columnDef.enableColumnFilter) {
    return <Box height={32} />;
  }

  if (!column.id) {
    // eslint-disable-next-line no-console
    console.warn("unknown column:", column);
    return false;
  }

  const getLabel: (value: TValue) => string =
    column.id === "active" ? getActiveLabel : getOtherLabel(column);
  const options: SelectOption[] =
    column.columnDef.meta?.options?.map((value) => {
      return {
        value: String(value),
        label: getLabel(value),
      };
    }) ?? [];

  if (column.columnDef.meta?.multiFilter) {
    if (!options.length) {
      // eslint-disable-next-line no-console
      console.warn("array filter without options:", column);
      return false;
    }

    return <MultiSelectFilter searchParamName={column.id} options={options} />;
  }
  if (options.length) {
    return <SingleSelectFilter options={options} searchParamName={column.id} />;
  }
  const values = getColumnValues(column, table);
  return <TextInputFilter searchParamName={column.id} options={values} />;
}

function getColumnValues<TData extends UniqueEntity, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  return unique(
    table
      .getCenterRows()
      .flatMap((r) => [r, ...r.subRows])
      .filter((r) => !/NEW_\w*_PARENT_ID/.test(r.original.id))
      .flatMap(getRowValues(column)),
  ).sort((a, b) => a.localeCompare(b));
}

function getRowValues<TData, TValue>(column: Column<TData, TValue>) {
  return (row: Row<TData>) => {
    return getLabels(row.getValue(column.id));
  };
}

function getLabels(value: unknown): string[] {
  if (isNullish(value) || value === "") {
    return [];
  }
  if (isArray(value)) {
    return value.flatMap((v) => getLabels(v));
  }
  if (isEntity(value)) {
    return [entityToString(value, true)];
  }
  return [String(value)];
}

export function useColumnFilters<TData>(columns: ColumnDef<TData>[]) {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const columnFilters: ColumnFiltersState = useMemo(
    () =>
      columns
        .filter((c) => c.enableColumnFilter)
        .flatMap(toColumnFilter(searchParams)),
    [columns, searchParams],
  );
  const onColumnFiltersChange = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const update = isFunction(updater) ? updater(columnFilters) : updater;
      replaceSearchParams(
        update.map(({ id, value }) => ({
          name: id,
          value: toStringOrArrayOfString(value),
        })),
      );
    },
    [columnFilters, replaceSearchParams],
  );
  return { columnFilters, onColumnFiltersChange };
}

function isEntity(e: unknown): e is { id: string; readableName?: string } {
  return isObjectType(e) && "id" in e && isString(e.id);
}

// eslint-disable-next-line func-style
export const actorsFilterFn: FilterFn<OrgUnit> = (
  row,
  _columnId,
  filterValue,
) => {
  return thisOrParentOrChildApplies(row, (orig) =>
    arrayFilter(orig.actors, filterValue),
  );
};

// eslint-disable-next-line func-style
export const matchingClientActorsFilterFn: FilterFn<Rule> = (
  row,
  _columnId,
  filterValue,
) => {
  return thisOrParentOrChildApplies(row, (orig) =>
    arrayFilter(orig._matchingClientActors, filterValue),
  );
};

// eslint-disable-next-line func-style
export const matchingServerActorsFilterFn: FilterFn<Rule> = (
  row,
  _columnId,
  filterValue,
) => {
  return thisOrParentOrChildApplies(row, (orig) =>
    arrayFilter(orig._matchingServerActors, filterValue),
  );
};

// eslint-disable-next-line func-style
export const matchingClientRulesFilterFn: FilterFn<Actor> = (
  row,
  _columnId,
  filterValue,
) => {
  return thisOrParentOrChildApplies(row, (orig) =>
    arrayFilter(orig._matchingClientRules, filterValue),
  );
};

// eslint-disable-next-line func-style
export const matchingServerRulesFilterFn: FilterFn<Actor> = (
  row,
  _columnId,
  filterValue,
) => {
  return thisOrParentOrChildApplies(row, (orig) =>
    arrayFilter(orig._matchingServerRules, filterValue),
  );
};

function arrayFilter(entities: UniqueEntity[], filterValue: unknown): boolean {
  const lowerFilterValue = (filterValue as string).toLowerCase();
  return (
    entities?.some((entity) =>
      entityToString(entity).toLowerCase().includes(lowerFilterValue),
    ) ?? false
  );
}

function thisOrParentOrChildApplies<T extends { _parent?: T }>(
  row: Row<T>,
  predicate: (orig: T) => boolean,
): boolean {
  if (row.original === undefined) {
    return false;
  }

  if (predicate(row.original)) {
    return true;
  }

  // if parent or child would match the filter, also show this row
  const parent = row.original._parent;
  if (parent !== undefined && predicate(parent)) {
    return true;
  }

  for (const childRow of row.subRows) {
    const child = childRow.original;
    if (child !== undefined && predicate(child)) {
      return true;
    }
  }
  return false;
}

export function getActorSelectorFilterFn(
  columnId: "client" | "server",
): FilterFn<Rule> {
  return (row: Row<Rule>, _columnId: string, filterValue): boolean => {
    const lowerFilterValue = (filterValue as string).toLowerCase();

    return thisOrParentOrChildApplies(
      row,
      (orig) =>
        orig[columnId] !== undefined &&
        Object.values(orig[columnId]).some((v: string) =>
          v.toLowerCase().includes(lowerFilterValue),
        ),
    );
  };
}

// eslint-disable-next-line func-style
export const orgUnitFilterFn: FilterFn<Actor> = (
  row,
  _columnId,
  filterValue,
) => {
  if (!row.original._orgUnit) {
    return false;
  }
  const lowerFilterValue = (filterValue as string).toLowerCase();

  return thisOrParentOrChildApplies(row, (orig) => {
    const ou = orig?._orgUnit;
    return (
      ou !== undefined &&
      entityToString(ou).toLowerCase().includes(lowerFilterValue)
    );
  });
};

export function getFilterFn<TData extends UniqueEntity>(
  fn: FilterFnOption<TData> | undefined,
  omitRows: string[],
): FilterFnOption<TData> | undefined {
  if (!isFunction(fn)) {
    return fn;
  }
  return (row, columnId, filterValue, addMeta) => {
    if (omitRows.includes(row.original.id)) {
      return true;
    }
    return fn(row, columnId, filterValue, addMeta);
  };
}
