/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfirmationDialogOptions } from "@eshg/lib-portal";
import { ApiBusinessModule, ApiVersion } from "@eshg/opendata-api";

import { buildOptionsFromBusinessModules } from "@/lib/shared/components/procedures/helper";

export function buildOpenDataBusinessModuleOptions() {
  return buildOptionsFromBusinessModules(Object.values(ApiBusinessModule));
}

export function deleteVersionDialogOptions({
  versionName,
}: ApiVersion): Pick<
  ConfirmationDialogOptions,
  "title" | "description" | "color" | "confirmLabel"
> {
  return {
    title: "Eintrag löschen?",
    description: `Möchten Sie den Eintrag „${versionName}” wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
    confirmLabel: "Löschen",
    color: "danger",
  };
}
