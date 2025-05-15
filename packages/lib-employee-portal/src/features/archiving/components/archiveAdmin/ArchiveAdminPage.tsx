/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ArchivingApiInterface } from "@eshg/lib-procedures-api";

import { MainContentLayout } from "../../../../components/layout/MainContentLayout";
import { StickyToolbarLayout } from "../../../../components/layout/StickyToolbarLayout";
import { RestrictedPage } from "../../../../components/page/RestrictedPage";
import { Toolbar } from "../../../../components/toolbar/Toolbar";

import { ArchiveAdminTable } from "./ArchiveAdminTable";

export interface ArchiveAdminPageProps {
  title: string;
  businessModule: ApiBusinessModule;
  archivingApi: ArchivingApiInterface;
}

export function ArchiveAdminPage(props: ArchiveAdminPageProps) {
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
