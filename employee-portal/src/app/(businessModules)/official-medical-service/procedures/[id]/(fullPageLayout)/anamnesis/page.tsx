/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";
import { isEmpty } from "remeda";

import { ApiProcedureStatus } from "@eshg/base-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import {
  ApiYesNoDontKnowAnswer,
  PatchAnamnesisRequest,
} from "@eshg/official-medical-service-api";

import { usePatchAnamnesisOptions } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  useGetAnamnesis,
  useGetProcedureDetails,
} from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { AnamnesisForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm";
import {
  AnamnesisFormValues,
  defaultAnamnesisFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm.config";
import {
  cleanOptionalValues,
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
  const patchAnamnesis = useHandledMutation(patchAnamnesisOptions);

  async function handleSubmit(values: AnamnesisFormValues) {
    const request: PatchAnamnesisRequest = mapToRequest(
      id,
      cleanOptionalValues(values, [
        { key: "hasPriorExaminations", value: false },
        { key: "hasDisability", value: false },
        { key: "appliedForRetirement", value: false },
        { key: "hadPastDiseasesOrDisabilities", value: false },
        { key: "answer", value: false },
        { key: "answer", value: ApiYesNoDontKnowAnswer.No },
        { key: "answer", value: ApiYesNoDontKnowAnswer.DontKnow },
      ]),
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
        onSubmit={handleSubmit}
        valuesToMutationBundle={(values) => ({
          mutationOptions: patchAnamnesisOptions,
          variableSupplier: () => mapToRequest(id, values),
        })}
      />
    </DisabledFormProvider>
  );
}
