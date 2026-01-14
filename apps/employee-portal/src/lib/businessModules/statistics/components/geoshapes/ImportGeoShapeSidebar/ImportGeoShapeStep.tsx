/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { DeletableFileField } from "@eshg/lib-employee-portal";
import { FileType, InputField } from "@eshg/lib-portal";

import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { AddGeoShapeValues } from "./ImportGeoShapeSidebar";

export function ImportGeoShapeStep({
  fieldName,
}: SidebarStepContentProps<AddGeoShapeValues>) {
  return (
    <Stack gap={3}>
      <DeletableFileField
        name={fieldName("file")}
        label="Karten-Datei für den Import auswählen:"
        required="Bitte GeoJSON-Datei importieren."
        accept={FileType.Geojson}
        placeholder=".geojson"
      />
      <InputField
        name={fieldName("title")}
        label="Name für Choroplethenkarte"
        required="Bitte Namen angeben."
        hint="Der Name wird in der Kartenauswahl angezeigt."
      />
    </Stack>
  );
}
