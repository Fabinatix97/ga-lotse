/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function CentralFileLinkTile({
  centralFileId,
  hasMatches,
  onAddLink,
}: {
  centralFileId?: string;
  hasMatches: boolean;
  onAddLink: (() => void) | false;
}) {
  return (
    <InfoTile name={"procedure-central-file-links"} title={"Stammdaten (WIP)"}>
      {hasMatches ? (
        isNonNullish(centralFileId) ? (
          <Typography>{centralFileId}</Typography>
        ) : (
          onAddLink !== false && (
            <FormAddMoreButton onClick={onAddLink}>
              Stammdaten hinzufügen
            </FormAddMoreButton>
          )
        )
      ) : (
        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <CloseIcon />
          Keine Treffer.
        </Stack>
      )}
    </InfoTile>
  );
}
