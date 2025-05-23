/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Sheet } from "@mui/joy";
import { useState } from "react";

import { ApiGetGdprProcedureResponse } from "@eshg/base-api";
import { useFileDownload } from "@eshg/lib-portal";

import { useGdprProcedureApi } from "@/lib/baseModule/api/clients";

export function DownloadReportButton({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  const gdprApi = useGdprProcedureApi();
  const fileDownload = useFileDownload(() =>
    gdprApi.getReportDocumentRaw({
      id: procedure.id,
    }),
  );

  const [loading, setLoading] = useState(false);

  function openPreview() {
    setLoading(true);
    void fileDownload.preview().finally(() => setLoading(false));
  }

  return (
    <Sheet>
      <Button
        loading={loading}
        loadingPosition="start"
        sx={{
          width: "100%",
          minWidth: "fit-content",
        }}
        onClick={() => openPreview()}
      >
        Antrag Dokument ansehen
      </Button>
    </Sheet>
  );
}
