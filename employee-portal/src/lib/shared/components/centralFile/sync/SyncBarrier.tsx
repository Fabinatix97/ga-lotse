/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { useRouter } from "next/navigation";

import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { SyncButton } from "@/lib/shared/components/centralFile/sync/SyncButton";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

interface SyncBarrierProps {
  outdated: boolean;
  syncHref: string;
}

export function SyncBarrier(props: SyncBarrierProps & RequiresChildren) {
  return (
    <>
      {props.outdated && <SyncButton href={props.syncHref} />}
      {props.children}
    </>
  );
}

export function useSyncBarrier(syncRoute: string, person: PersonDetails) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const router = useRouter();
  return {
    syncBarrier: function (action: () => void) {
      return function () {
        if (person.outdated) {
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
