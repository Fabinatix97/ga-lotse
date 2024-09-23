/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Switch } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { getRowIdentifier } from "@/lib/helpers/table";
import { useConfirmationDialog } from "@/lib/hooks/useConfirmationDialog";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";
import { useTranslation } from "@/lib/i18n/client";

function isActor(entity: OrgUnit | Actor | Rule | undefined): entity is Actor {
  const keys = Object.keys(entity ?? {});
  return (
    keys.includes("orgUnitId") ||
    (!keys.includes("actors") && !keys.includes("client"))
  );
}

function isRule(entity: OrgUnit | Actor | Rule | undefined): entity is Rule {
  const keys = Object.keys(entity ?? {});
  return keys.includes("client");
}

export function InteractiveActiveCell<TData extends OrgUnit | Actor | Rule>(
  props: Readonly<CellContext<TData, boolean>>,
): ReactNode {
  const adminApi = useAdminApi();

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
  const actor = isActor(props.row.original);
  const rule = isRule(props.row.original);

  function activate() {
    if (actor) {
      return adminApi.activateActorById(id);
    } else if (rule) {
      return adminApi.activateRuleById(id);
    } else {
      return adminApi.activateOrgUnitById(id);
    }
  }

  function deactivate() {
    if (actor) {
      return adminApi.deactivateActorById(id);
    } else if (rule) {
      return adminApi.deactivateRuleById(id);
    } else {
      return adminApi.deactivateOrgUnitById(id);
    }
  }

  async function switchActive() {
    if (!(await getConfirmation())) {
      return;
    }

    const response = props.getValue() ? await deactivate() : await activate();
    props.table.options.meta?.updateData({
      ...props.row.original,
      ...response,
    });
  }

  return (
    <>
      <Switch
        checked={props.getValue()}
        onChange={switchActive}
        onClick={(event) => event.stopPropagation()}
        slotProps={{
          input: {
            "aria-label": labelAction + " " + labelId,
          },
        }}
      />
      <div onClick={(event) => event.stopPropagation()}>
        {confirmationDialog}
      </div>
    </>
  );
}

export function ActiveCell<TData extends OrgUnit | Actor | Rule>(
  props: CellContext<TData, boolean>,
): ReactNode {
  return (
    <Stack justifyContent="center" direction="row">
      {getActiveLabel(props.getValue())}
    </Stack>
  );
}

export function getActiveLabel<TValue>(flag: TValue): string {
  return flag ? "✅" : "❌";
}
