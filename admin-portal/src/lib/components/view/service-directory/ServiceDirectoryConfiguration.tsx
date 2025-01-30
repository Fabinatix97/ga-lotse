/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetOrgUnitsResponse } from "@eshg/service-directory-api";
import { useMemo, useState } from "react";

import { PageContent } from "@/lib/components/view/PageContent";
import { ImportContent } from "@/lib/components/view/service-directory/dataTransfer/ImportContent";
import { useOrgUnitsQuery } from "@/lib/hooks/useOrgUnits";

import { ExportContent } from "./dataTransfer/ExportContent";

export function ServiceDirectoryConfiguration() {
  return (
    <PageContent
      title="serviceDirectoryHeader"
      query={useOrgUnitsQuery()}
      renderContent={(data) => <ServiceDirectoryContent data={data} />}
    />
  );
}

function ServiceDirectoryContent({
  data,
}: Readonly<{
  data: ApiGetOrgUnitsResponse;
}>) {
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>();

  useMemo(() => {
    setIsDbEmpty(data.orgUnits.length == 0);
  }, [data]);

  return isDbEmpty ? (
    <ImportContent isDbEmpty={isDbEmpty} setIsDbEmpty={setIsDbEmpty} />
  ) : (
    <ExportContent />
  );
}
