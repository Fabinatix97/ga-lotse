/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiBusinessModule,
  ApiProcedureType,
  ArchivingApiInterface,
} from "@eshg/lib-procedures-api";

import { MainContentLayout } from "../../../../components/layout/MainContentLayout";
import { StickyToolbarLayout } from "../../../../components/layout/StickyToolbarLayout";
import { RestrictedPage } from "../../../../components/page/RestrictedPage";
import { Toolbar } from "../../../../components/toolbar/Toolbar";

import { ArchiveTable } from "./ArchiveTable";

export interface ArchivePageProps {
  title: string;
  procedureDetailsRoute: (procedureId: string) => string;
  businessModule: ApiBusinessModule;
  archivingApi: ArchivingApiInterface;
  procedureTypes: ApiProcedureType[];
}

export function ArchivePage({ title, ...props }: ArchivePageProps) {
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
