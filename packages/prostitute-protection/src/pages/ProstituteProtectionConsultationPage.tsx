/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { ConsultationForm } from "../components/procedures/consultation/ConsultationForm";
import { mockProcedures } from "../mock";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { isProcedureClosed } from "../shared/helpers";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionConsultationPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  const procedure =
    mockProcedures.find((p) => p.id === procedureId) ?? mockProcedures[0]!;

  const isClosed = isProcedureClosed(procedure);

  return (
    <DisabledFormProvider disabled={isClosed}>
      <Stack sx={{ height: "100%" }}>
        <ConsultationForm procedure={procedure} />
      </Stack>
    </DisabledFormProvider>
  );
}
