/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { Stack } from "@mui/joy";

import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { DeletableFileField } from "@/lib/shared/components/formFields/file/DeletableFileField";

import { AddGeoShapeValues } from "./ImportGeoShapeSidebar";

export function ImportGeoShapeStep({
  fieldName,
}: SidebarStepContentProps<AddGeoShapeValues>) {
  return (
    <Stack gap={3}>
      <DeletableFileField
        name={fieldName("file")}
        label="Karten-Datei für den Import auswählen:"
        required="Bitte Shapefile importieren."
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
