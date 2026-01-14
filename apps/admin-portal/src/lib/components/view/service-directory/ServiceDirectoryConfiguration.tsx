/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useMemo, useState } from "react";

import { PageContent } from "@/lib/components/view/PageContent";
import { ImportContent } from "@/lib/components/view/service-directory/dataTransfer/ImportContent";
import { useEntities, useEntitiesQuery } from "@/lib/hooks/useEntities";

import { ExportContent } from "./dataTransfer/ExportContent";

export function ServiceDirectoryConfiguration() {
  return (
    <PageContent
      title="serviceDirectoryHeader"
      query={useEntitiesQuery()}
      renderContent={() => <ServiceDirectoryContent />}
    />
  );
}

function ServiceDirectoryContent() {
  const { committedOrgUnits, committedRules } = useEntities();
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>();

  useMemo(() => {
    setIsDbEmpty(committedOrgUnits.length === 0 && committedRules.length === 0);
  }, [committedOrgUnits, committedRules]);

  return isDbEmpty ? (
    <ImportContent isDbEmpty={isDbEmpty} setIsDbEmpty={setIsDbEmpty} />
  ) : (
    <ExportContent />
  );
}
