/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetGdprProcedureResponse } from "@eshg/employee-portal-api/base";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { Button, Sheet } from "@mui/joy";
import { useState } from "react";

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
        loadingPosition={"start"}
        onClick={() => openPreview()}
        sx={{
          width: "100%",
          minWidth: "fit-content",
        }}
      >
        Antrag Dokument ansehen
      </Button>
      <HiddenContainer ref={fileDownload.downloadContainerRef} />
    </Sheet>
  );
}
