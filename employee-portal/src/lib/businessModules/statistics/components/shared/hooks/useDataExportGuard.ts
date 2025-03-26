/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useConfirmationDialog } from "@eshg/lib-employee-portal";

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";

export function useDataExportGuard() {
  const { openConfirmationDialog } = useConfirmationDialog();
  return (
    dataSensitivity: DataSourceSensitivity,
    callback: () => void | Promise<void>,
  ) => {
    if (dataSensitivity !== DataSourceSensitivity.InternalUsage) {
      return callback();
    }

    openConfirmationDialog({
      onConfirm: callback,
      title: "Interner Gebrauch",
      color: "danger",
      description:
        "Der Datensatz enthält personenbezogene Daten und ist daher nur für den internen Gebrauch innerhalb des Gesundheitsamtes zugelassen.",
      confirmLabel: "Exportieren",
    });
  };
}
