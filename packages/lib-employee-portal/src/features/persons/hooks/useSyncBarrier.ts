/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRouter } from "next/navigation";

import { useConfirmationDialog } from "../../../hooks/useConfirmationDialog";
import { SyncableEntity } from "../types/SyncableEntity";

export function useSyncBarrier(
  syncRoute: string,
  syncableEntity: SyncableEntity,
) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const router = useRouter();
  return {
    syncBarrier: function (action: () => void) {
      return function () {
        if (syncableEntity.outdated) {
          openConfirmationDialog({
            title: "Update verfügbar",
            description:
              "Sie müssen das verfügbare Update annehmen, bevor Sie bearbeiten können.",
            confirmLabel: "Update durchführen",
            onConfirm: () => router.push(syncRoute),
          });
        } else {
          action();
        }
      };
    },
  };
}
