/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export function useDataExportGuard(isInternal: boolean) {
  const { openConfirmationDialog } = useConfirmationDialog();

  if (!isInternal) {
    return (callback: () => void | Promise<void>) => callback();
  }

  return (callback: () => void | Promise<void>) =>
    openConfirmationDialog({
      onConfirm: callback,
      title: "Interner Gebrauch",
      color: "danger",
      description:
        "Der Datensatz enthält personenbezogene Daten und ist daher nur für den internen Gebrauch innerhalb des Gesundheitsamtes zugelassen.",
      confirmLabel: "Exportieren",
    });
}
