/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/joy";

import { FormAddMoreButton } from "@eshg/lib-portal";

import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";

export function CentralFileLinkTile({
  numMatches,
  onAddLink,
  hasLinkedMatches,
}: {
  numMatches: number;
  onAddLink: (() => void) | false;
  hasLinkedMatches: boolean;
}) {
  return (
    <SectionTile id="procedure-central-file-links">
      <SectionTitle id="procedure-central-file-links">
        {numMatches > 0
          ? numMatches === 1
            ? "1 Datensatz gefunden"
            : `${numMatches} Datensätze gefunden`
          : hasLinkedMatches
            ? "Keine weiteren Datensätze gefunden"
            : "Keine Datensätze gefunden"}
      </SectionTitle>
      {numMatches > 0 ? (
        onAddLink !== false && (
          <FormAddMoreButton onClick={onAddLink}>
            Datensatz hinzufügen
          </FormAddMoreButton>
        )
      ) : (
        <Stack direction="row" gap={1} alignItems="center">
          <CloseIcon />
          Keine Treffer.
        </Stack>
      )}
    </SectionTile>
  );
}
