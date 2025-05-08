/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Switch } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ChangeEvent, ReactNode, useCallback } from "react";

import { Actor } from "@/lib/components/view/actors/ActorTable";
import { isOneOfStagedEntity } from "@/lib/helpers/entityFilter";
import { getRowIdentifier } from "@/lib/helpers/table";
import { useConfirmationDialog } from "@/lib/hooks/useConfirmationDialog";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";
import { useTranslation } from "@/lib/i18n/client";

export function ActiveCell(
  props:
    | Readonly<CellContext<OrgUnit, boolean>>
    | Readonly<CellContext<Actor, boolean>>
    | Readonly<CellContext<Rule, boolean>>,
): ReactNode {
  if (!isOneOfStagedEntity(props.row.original)) {
    return <InteractiveActiveCell {...props} />;
  }
  return <EditableActiveCell {...props} />;
}

function InteractiveActiveCell(
  props:
    | Readonly<CellContext<OrgUnit, boolean>>
    | Readonly<CellContext<Actor, boolean>>
    | Readonly<CellContext<Rule, boolean>>,
): ReactNode {
  const { t } = useTranslation();

  const labelAction = props.getValue() ? t("deactivate") : t("activate");
  const labelId = getRowIdentifier(props.row);

  const tKey = { entity: labelId };
  const content = props.getValue()
    ? t("deactivate-confirm", tKey)
    : t("activate-confirm", tKey);

  const { confirmationDialog, getConfirmation } = useConfirmationDialog(
    // i18next escapes slashes, but here they are safe
    content.replaceAll("&#x2F;", "/"),
  );

  const id = props.row.original.id;

  async function switchActive() {
    if (!(await getConfirmation())) {
      return;
    }

    if (props.getValue()) {
      props.table.options.meta?.api?.deactivate(id);
    } else {
      props.table.options.meta?.api?.activate(id);
    }
  }

  return (
    <>
      <Switch
        checked={props.getValue()}
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

function EditableActiveCell(
  props:
    | Readonly<CellContext<OrgUnit, boolean>>
    | Readonly<CellContext<Actor, boolean>>
    | Readonly<CellContext<Rule, boolean>>,
): ReactNode {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      props.table.options.meta?.api?.update({
        id: props.row.original.id,
        active: event.target.checked,
      });
    },
    [props.row, props.table.options.meta],
  );

  return (
    <Switch
      checked={props.getValue()}
      onChange={handleChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
