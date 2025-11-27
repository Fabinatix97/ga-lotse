/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { useGetProcedure } from "../api/queries/procedures";
import { ConsultationForm } from "../components/procedures/consultation/ConsultationForm";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { isProcedureFinalized } from "../shared/helpers";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionConsultationPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  const { data: procedure } = useGetProcedure(procedureId);

  return (
    <DisabledFormProvider disabled={isProcedureFinalized(procedure)}>
      <Stack sx={{ height: "100%" }}>
        <ConsultationForm procedure={procedure} />
      </Stack>
    </DisabledFormProvider>
  );
}
