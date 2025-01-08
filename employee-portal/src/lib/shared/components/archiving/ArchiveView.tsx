/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiProcedureType } from "@eshg/employee-portal-api/businessProcedures";

import { UseBulkUpdateProceduresArchivingRelevance } from "@/lib/shared/api/mutations/archiving";
import {
  UseGetArchivableProcedures,
  UseGetArchivingConfiguration,
} from "@/lib/shared/api/queries/archiving";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { ArchiveTable } from "@/lib/shared/components/archiving/components/archiveView/ArchiveTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export interface ArchiveViewProps {
  title: string;
  procedureDetailsRoute: (procedureId: string) => string;
  useGetArchivingConfiguration: UseGetArchivingConfiguration;
  useGetArchivableProcedures: UseGetArchivableProcedures;
  useBulkUpdateProceduresArchivingRelevance: UseBulkUpdateProceduresArchivingRelevance;
  additionalFilters: { procedureTypes: ApiProcedureType[] };
}

export function ArchiveView({ title, ...props }: ArchiveViewProps) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={`Archivierung: ${title}`} />}>
      <RestrictedPage requiredUserRole={ApiUserRole.ProcedureArchive}>
        <MainContentLayout fullViewportHeight>
          <ArchiveTable {...props} />
        </MainContentLayout>
      </RestrictedPage>
    </StickyToolbarLayout>
  );
}
