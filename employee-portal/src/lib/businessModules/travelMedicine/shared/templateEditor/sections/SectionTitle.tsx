/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/joy";

export function SectionTitle({
  sectionDeleteHandler,
  sectionFormikPath,
  label,
}: Readonly<{
  sectionDeleteHandler: () => void;
  sectionFormikPath: string;
  label: string;
}>) {
  return (
    <Stack flex={1} direction="row" spacing={2} style={{ paddingRight: 12 }}>
      <InputField
        label
        aria-label={label}
        name={`${sectionFormikPath}.sectionTitle`}
        placeholder="Sektionstitel eingeben"
        sx={{ flex: 1 }}
        data-testid="section-title"
      />
      <Stack alignItems="center" paddingTop={"6px"}>
        <IconButton
          aria-label="Entfernen"
          color="warning"
          variant="outlined"
          onClick={sectionDeleteHandler}
          title="Sektion Löschen"
          data-testid="section-delete-button"
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
