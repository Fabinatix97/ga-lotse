/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Button, Stack } from "@mui/joy";
import { isString } from "remeda";

export interface SyncFormButtonBarProps {
  onCancel: string | (() => void);
  onAccept: () => Promise<void>;
}

export function SyncFormButtonBar(props: SyncFormButtonBarProps) {
  const { openConfirmationDialog } = useConfirmationDialog();

  function saveWithConfirmation() {
    openConfirmationDialog({
      onConfirm: async () => {
        try {
          await props.onAccept();
        } catch {}
      },
      confirmLabel: "Bestätigen",
      title: "Änderungen übernehmen",
      description:
        "Die anzeigten Änderungen werden vollständig in den Vorgang übernommen. " +
        "Eine Rückkehr zum bisherigen Stand ist anschließend nicht möglich.",
    });
  }

  return (
    <Stack direction="row" gap={2} alignSelf="flex-end">
      {isString(props.onCancel) ? (
        <InternalLinkButton href={props.onCancel} variant="plain">
          Abbrechen
        </InternalLinkButton>
      ) : (
        <Button onClick={props.onCancel} variant="plain">
          Abbrechen
        </Button>
      )}
      <Button onClick={saveWithConfirmation}>Update</Button>
    </Stack>
  );
}
