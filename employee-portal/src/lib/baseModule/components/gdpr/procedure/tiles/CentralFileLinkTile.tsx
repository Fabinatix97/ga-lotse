/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";

export function CentralFileLinkTile({
  centralFileId,
  numMatches,
  onAddLink,
}: {
  centralFileId?: string;
  numMatches: number;
  onAddLink: (() => void) | false;
}) {
  return (
    <SectionTile id={"procedure-central-file-links"}>
      <SectionTitle id={"procedure-central-file-links"}>
        {numMatches > 0
          ? numMatches === 1
            ? "1 Datensatz gefunden"
            : `${numMatches} Datensätze gefunden`
          : "Keine Datensätze gefunden"}
      </SectionTitle>
      {numMatches > 0 ? (
        isNonNullish(centralFileId) ? (
          <Typography>{centralFileId}</Typography>
        ) : (
          onAddLink !== false && (
            <FormAddMoreButton onClick={onAddLink}>
              Datensatz hinzufügen
            </FormAddMoreButton>
          )
        )
      ) : (
        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <CloseIcon />
          Keine Treffer.
        </Stack>
      )}
    </SectionTile>
  );
}
