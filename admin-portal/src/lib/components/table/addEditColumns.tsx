/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, Delete, Edit, Save, Undo } from "@mui/icons-material";
import Done from "@mui/icons-material/Done";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/joy";
import Switch from "@mui/joy/Switch";
import {
  CellContext,
  ColumnDef,
  DisplayColumnDef,
  Row,
  Table,
} from "@tanstack/react-table";
import { ChangeEvent, useCallback } from "react";
import { only } from "remeda";

import {
  ApiAdminStagedEntityType,
  ApiGetOrgUnitsResponse,
  ApiStagingStatus,
} from "@eshg/service-directory-api";

import { useEntityCart } from "@/lib/components/context/EntityCart";
import { TableApi } from "@/lib/components/table/EditableTable";
import { getAdminName } from "@/lib/helpers/adminName";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import {
  OneOfStagedEntity,
  isOneOfStagedEntity,
} from "@/lib/helpers/entityFilter";
import { entityToString } from "@/lib/helpers/entityToString";
import { isValidEntity } from "@/lib/helpers/entityValidation";
import { useOrgUnitsQuery } from "@/lib/hooks/useOrgUnits";
import { useTranslation } from "@/lib/i18n/client";

export const EDIT_BUTTON_ID = "editButton";

function getEditButtonColumnDef<
  TData extends UniqueEntity & EditableEntity,
>(): DisplayColumnDef<TData> {
  return {
    id: EDIT_BUTTON_ID,
    meta: {
      cellStyle: "button",
    },
    cell: EditButton,
  };
}

export function HeaderButtons<TData extends UniqueEntity>({
  table,
}: Readonly<{
  table: Table<TData>;
}>) {
  const { t } = useTranslation();
  const { data: getOrgUnitsResponse } = useOrgUnitsQuery();

  return (
    <IconButton
      size="sm"
      aria-label={t("create")}
      onClick={() => create(table, getOrgUnitsResponse)}
    >
      <Add />
    </IconButton>
  );
}

function EditButton<TData extends UniqueEntity & EditableEntity>({
  row,
  table,
}: Readonly<CellContext<TData, unknown>>) {
  const { t } = useTranslation();

  if (isOneOfStagedEntity(row.original)) {
    const api = table.options.meta?.api as
      | TableApi<OneOfStagedEntity>
      | undefined;
    return <StagedRowButtons api={api} row={row.original} />;
  }

  return (
    <>
      <IconButton
        size="sm"
        aria-label={t("edit")}
        onClick={() => {
          edit(table, row);
        }}
        disabled={!!row.original._staged.length}
      >
        <Edit />
      </IconButton>
      <IconButton
        size="sm"
        aria-label={t("delete")}
        onClick={(event) => {
          event.stopPropagation();
          deleteRow(table, row);
        }}
        disabled={!!row.original._staged.length}
      >
        <Delete />
      </IconButton>
    </>
  );
}

export function StagedRowButtons({
  api,
  row,
}: Readonly<{
  api: TableApi<OneOfStagedEntity> | undefined;
  row: OneOfStagedEntity;
}>) {
  const { t } = useTranslation();

  const { addEntity, removeEntity, canAddEntity } = useEntityCart();

  const isReadyForReview =
    row.stagingStatus === ApiStagingStatus.ReadyForReview;

  const handleReadyForReviewChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const ready = event.target.checked;
      api?.update({
        id: row.id,
        author: row.author,
        stagedEntityType: row.stagedEntityType,
        stagingStatus: ready
          ? ApiStagingStatus.ReadyForReview
          : ApiStagingStatus.WorkInProgress,
      });
    },
    [api, row],
  );

  if (row.author === getAdminName()) {
    const isDeletion = row.stagedEntityType !== ApiAdminStagedEntityType.Del;
    return (
      <>
        <Switch
          color={isReadyForReview ? "success" : "danger"}
          slotProps={{
            input: { "aria-label": t("readyForReview") },
            thumb: {
              children: isReadyForReview ? <Done /> : <ModeEdit />,
            },
          }}
          sx={{
            visibility: isValidEntity(row) && isDeletion ? "visible" : "hidden",
          }}
          checked={isReadyForReview}
          onChange={handleReadyForReviewChange}
          onClick={(event) => event.stopPropagation()}
        />
        <IconButton
          size="sm"
          aria-label={t("discard")}
          onClick={(event) => {
            event.stopPropagation();
            clear(api, row, removeEntity);
          }}
        >
          <Undo />
        </IconButton>
      </>
    );
  } else if (isReadyForReview) {
    return (
      <>
        <IconButton
          size="sm"
          aria-label={t("apply")}
          onClick={(event) => {
            event.stopPropagation();
            addEntity(row);
          }}
          disabled={!canAddEntity(row)}
        >
          <Save />
        </IconButton>
        <IconButton
          size="sm"
          aria-label={t("discard")}
          onClick={(event) => {
            event.stopPropagation();
            clear(api, row, removeEntity);
          }}
        >
          <Undo />
        </IconButton>
      </>
    );
  } else {
    return false;
  }
}

function create<TData extends UniqueEntity>(
  table: Table<TData>,
  getOrgUnitsResponse?: ApiGetOrgUnitsResponse,
) {
  const uuid = getOrgUnitIdFromFilter(table, getOrgUnitsResponse);
  table.options.meta?.api?.create(uuid);
}

function getOrgUnitIdFromFilter<TData>(
  table: Table<TData>,
  getOrgUnitsResponse?: ApiGetOrgUnitsResponse,
) {
  const orgUnitSearchString = table
    .getState()
    .columnFilters.find(({ id }) => id === "_orgUnit")
    ?.value?.toString()
    .toLowerCase();
  if (!orgUnitSearchString) return undefined;

  const matchingOrgUnits = getOrgUnitsResponse?.orgUnits.filter((ou) =>
    entityToString(ou).toLowerCase().includes(orgUnitSearchString),
  );
  if (!matchingOrgUnits) return undefined;

  return only(matchingOrgUnits)?.id;
}

function clear(
  api: TableApi<OneOfStagedEntity> | undefined,
  row: OneOfStagedEntity,
  removeEntity: (id: string) => void,
) {
  removeEntity(row.id);
  api?.deleteStaged(row.id);
}

function edit<TData extends UniqueEntity & EditableEntity>(
  table: Table<TData>,
  row: Row<TData>,
) {
  table.options.meta?.api?.update(row.original);
}

function deleteRow<TData extends UniqueEntity & EditableEntity>(
  table: Table<TData>,
  row: Row<TData>,
) {
  table.options.meta?.api?.deleteAudited(row.original.id);
}

export function addEditColumns<TData extends UniqueEntity>(
  columns: ColumnDef<TData>[],
): ColumnDef<TData>[] {
  const editButtonColumn = getEditButtonColumnDef() as DisplayColumnDef<TData>;
  columns = [...columns, editButtonColumn];

  return columns;
}
