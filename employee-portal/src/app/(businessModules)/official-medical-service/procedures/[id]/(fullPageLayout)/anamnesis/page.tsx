/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";
import { isEmpty } from "remeda";

import { ApiProcedureStatus } from "@eshg/base-api";
import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";
import {
  AnamnesisFormValues,
  defaultAnamnesisFormValues,
} from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/formConfig";
import { cleanOptionalValues } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/helpers";
import { PatchAnamnesisRequest } from "@eshg/official-medical-service-api";

import { usePatchAnamnesisOptions } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  useGetAnamnesis,
  useGetProcedureDetails,
} from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { AnamnesisForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm";
import {
  mapToFormValues,
  mapToRequest,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/helpers";

export default function OfficialMedicalServiceAnamnesisPage(
  props: DynamicPageProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = use(props.params);

  const [{ data: procedure }, { data: anamnesis }] = useSuspenseQueries({
    queries: [useGetProcedureDetails(id), useGetAnamnesis(id)],
  });

  const patchAnamnesisOptions = usePatchAnamnesisOptions();
  const patchAnamnesis = useMutation(patchAnamnesisOptions);

  async function handleSubmit(values: AnamnesisFormValues) {
    const request: PatchAnamnesisRequest = mapToRequest(
      id,
      cleanOptionalValues(values),
    );
    await patchAnamnesis.mutateAsync(request);
  }

  return (
    <DisabledFormProvider
      disabled={procedure.status === ApiProcedureStatus.Closed}
    >
      <AnamnesisForm
        initialValues={
          !isEmpty(anamnesis)
            ? mapToFormValues(anamnesis)
            : defaultAnamnesisFormValues()
        }
        valuesToMutationBundle={(values) => ({
          mutationOptions: patchAnamnesisOptions,
          variableSupplier: () => mapToRequest(id, values),
        })}
        onSubmit={handleSubmit}
      />
    </DisabledFormProvider>
  );
}
