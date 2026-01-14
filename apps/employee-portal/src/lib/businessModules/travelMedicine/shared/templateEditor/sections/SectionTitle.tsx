/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/joy";

import { InputField } from "@eshg/lib-portal";

import { validateSectionTitle } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function SectionTitle({
  sectionDeleteHandler,
  sectionFormikPath,
  label,
  showDeleteSectionButton,
  setInputElementRef,
}: Readonly<{
  sectionDeleteHandler: () => void;
  sectionFormikPath: string;
  label: string;
  showDeleteSectionButton: boolean;
  setInputElementRef: (el: HTMLInputElement) => void;
}>) {
  return (
    <Stack flex={1} direction="row" spacing={2}>
      <InputField
        ref={setInputElementRef}
        label
        aria-label={label}
        name={`${sectionFormikPath}.sectionTitle`}
        placeholder="Sektionstitel eingeben"
        validate={validateSectionTitle()}
        sx={{ flex: 1 }}
        data-testid="section-title"
      />
      {showDeleteSectionButton && (
        <Stack alignItems="center" paddingTop="6px">
          <IconButton
            aria-label="Entfernen"
            color="warning"
            variant="outlined"
            title="Sektion Löschen"
            data-testid="section-delete-button"
            onClick={sectionDeleteHandler}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}
