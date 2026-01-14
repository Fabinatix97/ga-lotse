/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal";

import { useGetProcedure } from "../api/queries/procedures";
import { CertificatesTable } from "../components/procedures/certificates/CertificatesTable";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionCertificatesPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  const { data: procedure } = useGetProcedure(procedureId);

  return <CertificatesTable procedureId={procedure.id} />;
}
