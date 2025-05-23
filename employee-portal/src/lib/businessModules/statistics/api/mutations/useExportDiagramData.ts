/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { downloadFileAndOpen, useHandledMutation } from "@eshg/lib-portal";

import { useDataExportApi } from "@/lib/businessModules/statistics/api/clients";

export function useExportDiagramData(diagramId: string) {
  const dataExportApi = useDataExportApi();
  const mutation = useHandledMutation({
    mutationFn: () => dataExportApi.exportDiagramData(diagramId),
    onSuccess: (result) =>
      downloadFileAndOpen(new File([result], "Diagramm.xlsx")),
  });

  return () => {
    mutation.mutate();
  };
}
