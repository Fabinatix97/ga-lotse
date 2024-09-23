/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/inspection";
import AddIcon from "@mui/icons-material/Add";
import { Stack, Typography } from "@mui/joy";
import Link from "@mui/joy/Link";

import { isUnknownUser } from "@/lib/businessModules/inspection/shared/isUnknownUser";
import { UserLink } from "@/lib/shared/components/users/UserLink";

interface PacklistDefinitionHeaderRowProps {
  readOnlyMode: boolean;
  newestRevision: boolean;
  revision?: number;
  modifiedBy?: ApiUser;
  defId?: string;
  version?: number;
  revisionId?: string;
  onClickNewRevision?: (
    defId: string,
    version: number,
    revisionId: string,
  ) => void;
}

export function PacklistDefinitionHeaderRow({
  readOnlyMode,
  newestRevision,
  revision,
  modifiedBy,
  defId,
  version,
  revisionId,
  onClickNewRevision,
}: Readonly<PacklistDefinitionHeaderRowProps>) {
  const canCreateNewRevision = newestRevision && !!defId && !!revisionId;

  const revisionLabel = (revision ?? 0) + (readOnlyMode ? 0 : 1);

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent={revision ? "space-between" : "flex-end"}
    >
      {revision && <Typography>Version {revisionLabel}</Typography>}

      {modifiedBy && !isUnknownUser(modifiedBy) && (
        <Typography>
          Zuletzt bearbeitet: <UserLink user={modifiedBy} />
        </Typography>
      )}

      {readOnlyMode && (
        <Link
          onClick={
            onClickNewRevision
              ? () =>
                  onClickNewRevision(
                    defId ?? "",
                    version ?? -1,
                    revisionId ?? "",
                  )
              : () => undefined
          }
          disabled={!canCreateNewRevision}
          variant="plain"
          startDecorator={<AddIcon />}
        >
          Neue Version anlegen
        </Link>
      )}
    </Stack>
  );
}
