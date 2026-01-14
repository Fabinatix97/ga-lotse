/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { ApiUser } from "@eshg/inspection-api";
import { SubmitButton } from "@eshg/lib-portal";

import { isUnknownUser } from "@/lib/businessModules/inspection/shared/isUnknownUser";
import { UserLink } from "@/lib/shared/components/users/UserLink";

interface ChecklistDefinitionHeaderRowProps {
  version?: number;
  modifiedBy?: ApiUser;
  isSubmitting?: boolean;
  hasDraft?: boolean;
  onPublish(publish: boolean): void;
}

export function ChecklistDefinitionHeaderRow({
  version,
  modifiedBy,
  isSubmitting = false,
  hasDraft,
  onPublish,
}: Readonly<ChecklistDefinitionHeaderRowProps>) {
  const versionLabel = (version ?? 0) + (hasDraft ? 0 : 1);

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent={version ? "space-between" : "flex-end"}
    >
      {version && <Typography>Version {versionLabel}</Typography>}

      {modifiedBy && !isUnknownUser(modifiedBy) && (
        <Typography>
          Zuletzt bearbeitet: <UserLink user={modifiedBy} />
        </Typography>
      )}

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <ChecklistDefinitionSubmitButtons
          isSubmitting={isSubmitting}
          onPublish={onPublish}
        />
      </Stack>
    </Stack>
  );
}

export function ChecklistDefinitionSubmitButtons({
  isSubmitting = false,
  onPublish,
}: Readonly<
  Pick<ChecklistDefinitionHeaderRowProps, "isSubmitting" | "onPublish">
>) {
  return (
    <>
      <SubmitButton
        key="draft"
        variant="outlined"
        submitting={isSubmitting}
        onClick={() => onPublish(false)}
      >
        Als Entwurf speichern
      </SubmitButton>
      <SubmitButton
        key="publish"
        submitting={isSubmitting}
        onClick={() => onPublish(true)}
      >
        Checkliste veröffentlichen
      </SubmitButton>
    </>
  );
}
