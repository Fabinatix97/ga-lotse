/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfirmationDialog } from "@eshg/lib-employee-portal";
import { ConfirmationDialogProps } from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialog";

export function LeaveChatConfirmation(props: ConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      key="leave-room-dialog"
      color="danger"
      title="Wollen Sie den Chat wirklich verlassen?"
      description="Wenn Sie den Chat verlassen, können Sie keine neuen Nachrichten mehr empfangen."
      confirmLabel="Verlassen"
      {...props}
    />
  );
}
