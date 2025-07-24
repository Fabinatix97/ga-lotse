/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, Delete, Edit, Save, Undo } from "@mui/icons-material";
import Done from "@mui/icons-material/Done";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/joy";
import Switch from "@mui/joy/Switch";
import { CellContext, DisplayColumnDef, Table } from "@tanstack/react-table";
import { ChangeEvent, useCallback } from "react";
import { only } from "remeda";

import {
  ApiAdminStagedEntityType,
  ApiStagingStatus,
} from "@eshg/service-directory-api";

import { useEntityCart } from "@/lib/components/context/EntityCart";
import { getAdminName } from "@/lib/helpers/adminName";
import { entityToString } from "@/lib/helpers/entityToString";
import { isValidEntity } from "@/lib/helpers/entityValidation";
import { useCreateEntity } from "@/lib/hooks/useCreateEntity";
import { useDeleteAuditedEntity } from "@/lib/hooks/useDeleteAuditedEntity";
import { useDeleteStagedEntity } from "@/lib/hooks/useDeleteStagedEntity";
import {
  EntityWrapper,
  OrgUnit,
  StagedEntity,
  UniqueEntity,
  isCommittedEntity,
  isStagedEntity,
  useEntities,
} from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";
import { useTranslation } from "@/lib/i18n/client";

export const EDIT_BUTTON_ID = "editButton";

export function getEditButtonColumnDef<
  TData extends EntityWrapper,
>(): DisplayColumnDef<TData> {
  return {
    id: EDIT_BUTTON_ID,
    meta: {
      cellStyle: "button",
    },
    cell: EditButtonCell,
  };
}

export function HeaderButtons<TData extends UniqueEntity>({
  table,
}: Readonly<{
  table: Table<TData>;
}>) {
  const { t } = useTranslation();
  const { allOrgUnits } = useEntities();
  const create = useCreateEntity();

  return (
    <IconButton
      size="sm"
      aria-label={t("create")}
      onClick={() => {
        const orgUnit = getOrgUnitFromFilter(table, allOrgUnits);
        return create(orgUnit);
      }}
    >
      <Add />
    </IconButton>
  );
}

function EditButtonCell<TData extends EntityWrapper>({
  row,
}: Readonly<CellContext<TData, unknown>>) {
  return <EditButton entity={row.original} />;
}

export function EditButton({ entity }: Readonly<{ entity: EntityWrapper }>) {
  const { t } = useTranslation();
  const updateEntity = useUpdateEntity();
  const deleteAuditedEntity = useDeleteAuditedEntity();

  if (isStagedEntity(entity)) {
    return <StagedRowButtons entity={entity} />;
  }

  return (
    <>
      <IconButton
        size="sm"
        aria-label={t("edit")}
        disabled={!!entity._staged.length}
        onClick={() => {
          edit(updateEntity, entity);
        }}
      >
        <Edit />
      </IconButton>
      <IconButton
        size="sm"
        aria-label={t("delete")}
        disabled={!!entity._staged.length}
        onClick={(event) => {
          event.stopPropagation();
          deleteAuditedEntity(entity);
        }}
      >
        <Delete />
      </IconButton>
    </>
  );
}

export function StagedRowButtons({
  entity,
}: Readonly<{
  entity: StagedEntity;
}>) {
  const { t } = useTranslation();
  const updateEntity = useUpdateEntity();
  const deleteStagedEntity = useDeleteStagedEntity();

  const { addEntity, removeEntity, canAddEntity } = useEntityCart();

  const isReadyForReview =
    entity.stagingStatus === ApiStagingStatus.ReadyForReview;

  const handleReadyForReviewChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const stagingStatus = event.target.checked
        ? ApiStagingStatus.ReadyForReview
        : ApiStagingStatus.WorkInProgress;
      updateEntity(entity, { stagingStatus });
    },
    [updateEntity, entity],
  );

  if (entity.author === getAdminName()) {
    const isDeletion = entity.stagedEntityType !== ApiAdminStagedEntityType.Del;
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
            visibility:
              isValidEntity(entity) && isDeletion ? "visible" : "hidden",
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
            clear(entity, removeEntity, deleteStagedEntity);
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
          disabled={!canAddEntity(entity)}
          onClick={(event) => {
            event.stopPropagation();
            addEntity(entity);
          }}
        >
          <Save />
        </IconButton>
        <IconButton
          size="sm"
          aria-label={t("discard")}
          onClick={(event) => {
            event.stopPropagation();
            clear(entity, removeEntity, deleteStagedEntity);
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

function getOrgUnitFromFilter<TData>(
  table: Table<TData>,
  allOrgUnits: OrgUnit[],
) {
  const orgUnitSearchString = table
    .getState()
    .columnFilters.find(({ id }) =>
      ["entity._orgUnit", "entity._exactOrgUnitIds"].includes(id),
    )
    ?.value?.toString()
    .toLowerCase();
  if (!orgUnitSearchString) return undefined;

  const matchingOrgUnits = allOrgUnits.filter((ou) =>
    entityToString(ou).toLowerCase().includes(orgUnitSearchString),
  );
  if (!matchingOrgUnits) return undefined;

  if (matchingOrgUnits.length > 1) {
    const matchingCommittedOrgUnits = matchingOrgUnits.filter((ou) =>
      isCommittedEntity(ou),
    );
    return only(matchingCommittedOrgUnits);
  }

  return only(matchingOrgUnits);
}

function clear(
  row: StagedEntity,
  removeEntity: (id: string) => void,
  deleteStagedEntity: (id: string) => void,
) {
  removeEntity(row.id);
  deleteStagedEntity(row.id);
}

function edit<TData extends EntityWrapper>(
  updateEntity: (
    entity: EntityWrapper,
    update?: Record<string, string | boolean | null | undefined | object>,
  ) => void,
  entity: TData,
) {
  updateEntity(entity);
}
