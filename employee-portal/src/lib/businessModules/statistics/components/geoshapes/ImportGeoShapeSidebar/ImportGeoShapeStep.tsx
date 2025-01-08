/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { Stack } from "@mui/joy";

import { DeletableFileField } from "@/lib/shared/components/formFields/file/DeletableFileField";

export function ImportGeoShapeStep() {
  return (
    <>
      <Stack gap={3}>
        <DeletableFileField
          name="file"
          label="Karten-Datei für den Import auswählen:"
          required="Bitte Shapefile importieren."
          accept={FileType.Geojson}
          placeholder=".geojson"
        />
        <InputField
          name="title"
          label="Name für Choroplethenkarte"
          required="Bitte Namen angeben."
          hint="Der Name wird in der Kartenauswahl angezeigt."
        />
      </Stack>
    </>
  );
}
