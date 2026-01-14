/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Switch } from "@mui/joy";
import { ChangeEvent, ReactNode, useCallback } from "react";

import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { entityToString } from "@/lib/helpers/entityToString";
import { useConfirmationDialog } from "@/lib/hooks/useConfirmationDialog";
import {
  ActorData,
  OrgUnitData,
  RuleData,
  isStagedEntity,
} from "@/lib/hooks/useEntities";
import { useToggleActive } from "@/lib/hooks/useToggleActive";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";
import { useTranslation } from "@/lib/i18n/client";

export function ActiveCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<CommonCellProps<EData>>,
): ReactNode {
  return isStagedEntity(props.entity) ? (
    <EditableActiveCell {...props} />
  ) : (
    <InteractiveActiveCell {...props} />
  );
}

function InteractiveActiveCell<
  EData extends OrgUnitData | ActorData | RuleData,
>(props: Readonly<CommonCellProps<EData>>): ReactNode {
  const { t } = useTranslation();
  const toggle = useToggleActive();

  const value = props.entity.entity?.active;

  const labelAction = value ? t("deactivate") : t("activate");
  const labelId = entityToString(props.entity, true);

  const tKey = { entity: labelId };
  const content = value
    ? t("deactivate-confirm", tKey)
    : t("activate-confirm", tKey);

  const { confirmationDialog, getConfirmation } = useConfirmationDialog(
    // i18next escapes slashes, but here they are safe
    content.replaceAll("&#x2F;", "/"),
  );

  async function switchActive() {
    if (!(await getConfirmation())) {
      return;
    }
    toggle(props.entity);
  }

  return (
    <>
      <Switch
        checked={value}
        slotProps={{
          input: {
            "aria-label": labelAction + " " + labelId,
          },
        }}
        onChange={switchActive}
        onClick={(event) => event.stopPropagation()}
      />
      <div onClick={(event) => event.stopPropagation()}>
        {confirmationDialog}
      </div>
    </>
  );
}

export function getActiveLabel<TValue>(flag: TValue): string {
  return flag ? "✅" : "❌";
}

function EditableActiveCell<EData extends OrgUnitData | ActorData | RuleData>(
  props: Readonly<CommonCellProps<EData>>,
): ReactNode {
  const updateEntity = useUpdateEntity();
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateEntity(props.entity, { active: event.target.checked });
    },
    [props.entity, updateEntity],
  );

  const value = props.entity.entity?.active;

  return (
    <Switch
      checked={value}
      disabled={!props.editable}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
