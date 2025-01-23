/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

import { resolveProcedureProgressEntriesRoute } from "@/lib/baseModule/moduleRegister/routeResolver";

export function ProgressEntryInternalLink({
  businessModule,
  procedureId,
}: {
  businessModule: ApiBusinessModule;
  procedureId: string;
}) {
  return (
    <InternalLink
      href={resolveProcedureProgressEntriesRoute(businessModule, procedureId)}
      sx={{ marginLeft: "auto" }}
    >
      Details
    </InternalLink>
  );
}
