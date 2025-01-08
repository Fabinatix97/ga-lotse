/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";

export function ProcedureInternalLink({
  businessModule,
  procedureId,
}: {
  businessModule: ApiBusinessModule;
  procedureId: string;
}) {
  return (
    <InternalLink
      href={resolveProcedureDetailsRoute({
        businessModule,
        procedureId,
      })}
      sx={{ marginLeft: "auto" }}
    >
      Details
    </InternalLink>
  );
}
