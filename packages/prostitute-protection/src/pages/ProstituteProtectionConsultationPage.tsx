/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { useConsultationQueryOptions } from "../api/queries/consultation";
import { useGetProcedureOptions } from "../api/queries/procedures";
import { ConsultationForm } from "../components/procedures/consultation/ConsultationForm";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { isProcedureFinalized } from "../shared/helpers";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionConsultationPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  const [{ data: procedure }, { data: consultation }] = useSuspenseQueries({
    queries: [
      useGetProcedureOptions(procedureId),
      useConsultationQueryOptions(procedureId),
    ],
  });

  return (
    <DisabledFormProvider disabled={isProcedureFinalized(procedure)}>
      <ConsultationForm procedure={procedure} consultation={consultation} />
    </DisabledFormProvider>
  );
}
