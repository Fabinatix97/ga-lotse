/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Check, Close } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

export interface ReadOnlyCLDElementTextModuleProps {
  textModuleFalse?: string;
  textModuleTrue?: string;
  sx?: SxProps;
  id?: string;
}

export function ReadOnlyCLDElementTextModule({
  textModuleFalse,
  textModuleTrue,
  sx,
  id,
}: Readonly<ReadOnlyCLDElementTextModuleProps>) {
  if (!textModuleTrue && !textModuleFalse) {
    return;
  }

  return (
    <Sheet sx={sx} id={id} role="region" aria-labelledby={`${id}-label`}>
      <Stack gap={1}>
        <Typography
          id={`${id}-label`}
          level="title-sm"
          fontWeight="normal"
          component="label"
        >
          Textbausteine
        </Typography>
        {textModuleTrue && (
          <Typography
            alignItems="start"
            level="body-sm"
            startDecorator={<Check />}
            aria-label="Textbaustein für Antwort ausgewählt"
            sx={{ whiteSpace: "pre", textWrap: "wrap" }}
          >
            {textModuleTrue}
          </Typography>
        )}
        {textModuleFalse && (
          <Typography
            alignItems="start"
            level="body-sm"
            startDecorator={<Close />}
            aria-label="Textbaustein für Antwort nicht ausgewählt"
            sx={{ whiteSpace: "pre", textWrap: "wrap" }}
          >
            {textModuleFalse}
          </Typography>
        )}
      </Stack>
    </Sheet>
  );
}

export function ReadOnlyCLDElementCheckboxTextModule({
  textModuleTrue,
  sx,
  id,
}: Readonly<ReadOnlyCLDElementTextModuleProps>) {
  if (!textModuleTrue) {
    return;
  }

  return (
    <Sheet sx={sx} role="region">
      <Typography
        id={id}
        level="body-sm"
        sx={{
          whiteSpace: "pre",
          textWrap: "wrap",
        }}
        aria-label="Textbaustein"
      >
        {textModuleTrue}
      </Typography>
    </Sheet>
  );
}
