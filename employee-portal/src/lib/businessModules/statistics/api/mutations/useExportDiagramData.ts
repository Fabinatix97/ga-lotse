/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useDataExportApi } from "@/lib/businessModules/statistics/api/clients";

export function useExportDiagramData(diagramId: string) {
  const dataExportApi = useDataExportApi();
  const mutation = useHandledMutation({
    mutationFn: () => dataExportApi.exportData(diagramId),
    onSuccess: (result) =>
      downloadFileAndOpen(new File([result], "Diagramm.xlsx"), document.body),
  });

  return () => {
    mutation.mutate();
  };
}
