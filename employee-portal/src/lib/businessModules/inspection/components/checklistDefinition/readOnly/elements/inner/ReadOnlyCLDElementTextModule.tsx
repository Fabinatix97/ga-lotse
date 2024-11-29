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
  text: string;
  elementTitle: string;
  sx?: SxProps;
}

export function ReadOnlyCLDElementTextModule({
  textModuleFalse,
  textModuleTrue,
  text,
  elementTitle,
  sx,
}: Readonly<ReadOnlyCLDElementTextModuleProps>) {
  if (!textModuleTrue && !textModuleFalse) {
    return;
  }

  return (
    <Sheet
      sx={sx}
      role="region"
      aria-label={`Textbausteine für Antwort "${text}" in Element "${elementTitle}"`}
    >
      <Stack gap={1}>
        <Typography level="title-sm" fontWeight="normal" component="label">
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
  text,
  elementTitle,
  sx,
}: Readonly<ReadOnlyCLDElementTextModuleProps>) {
  if (!textModuleTrue) {
    return;
  }

  return (
    <Sheet sx={sx}>
      <Typography
        level="body-sm"
        sx={{
          whiteSpace: "pre",
          textWrap: "wrap",
        }}
        aria-label={`Textbaustein für Antwort "${text}" in Element "${elementTitle}"`}
      >
        {textModuleTrue}
      </Typography>
    </Sheet>
  );
}
