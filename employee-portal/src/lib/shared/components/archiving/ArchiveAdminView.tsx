/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/base-api";

import {
  UseBulkUpdateProceduresArchivingRelevance,
  UseExportRelevantProcedures,
} from "@/lib/shared/api/mutations/archiving";
import { UseGetRelevantArchivableProcedures } from "@/lib/shared/api/queries/archiving";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { ArchiveAdminTable } from "@/lib/shared/components/archiving/components/archiveAdminView/ArchiveAdminTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export interface ArchiveAdminViewProps {
  title: string;
  useGetRelevantArchivableProcedures: UseGetRelevantArchivableProcedures;
  useExportRelevantProcedures: UseExportRelevantProcedures;
  useBulkUpdateProceduresArchivingRelevance: UseBulkUpdateProceduresArchivingRelevance;
}

export function ArchiveAdminView(props: ArchiveAdminViewProps) {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={`Archiv-Admin: ${props.title}`} />}
    >
      <RestrictedPage requiredUserRole={ApiUserRole.ProcedureArchiveAdmin}>
        <MainContentLayout fullViewportHeight>
          <ArchiveAdminTable {...props} />
        </MainContentLayout>
      </RestrictedPage>
    </StickyToolbarLayout>
  );
}
