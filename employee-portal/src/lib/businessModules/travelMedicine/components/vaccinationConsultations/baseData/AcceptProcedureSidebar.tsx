/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiCountryCode,
  ApiGender,
  ApiGetVaccinationConsultationDetailsResponse,
  ApiPatient,
  ApiPersonAddress,
  ApiSalutation,
} from "@eshg/travel-medicine-api";

import { useAcceptDraftVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { AcceptProcedureForm } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AcceptProcedureForm";
import { SearchPersonFormValues } from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useAcceptProcedureSidebar(): UseSidebarWithFormRefResult<AcceptProcedureSidebarProps> {
  return useSidebarWithFormRef({
    component: AcceptProcedureSidebar,
  });
}

interface AcceptProcedureSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiGetVaccinationConsultationDetailsResponse;
  queryResults?: ApiGetReferencePersonResponse[];
}

export interface PatientFormValues extends SearchPersonFormValues {
  emailAddresses: OptionalFieldValue<string>[];
  phoneNumbers: OptionalFieldValue<string>[];
  address: OptionalFieldValue<ApiPersonAddress>;
  countryOfBirth: OptionalFieldValue<ApiCountryCode>;
  gender: OptionalFieldValue<ApiGender>;
  nameAtBirth: OptionalFieldValue<string>;
  placeOfBirth: OptionalFieldValue<string>;
  salutation: OptionalFieldValue<ApiSalutation>;
  title: OptionalFieldValue<string>;
}

export function instanceOfApiGetReferencePersonResponse(
  data: ApiGetReferencePersonResponse | ApiPatient,
): data is ApiGetReferencePersonResponse {
  return "id" in data;
}

function AcceptProcedureSidebar(props: Readonly<AcceptProcedureSidebarProps>) {
  const acceptDraftVaccinationConsultation =
    useAcceptDraftVaccinationConsultation();

  async function handleCreate(procedureId: string, referencePersonId?: string) {
    const request = {
      procedureId: procedureId,
      apiPatchAcceptDraftRequest: {
        referencePersonId: referencePersonId ?? undefined,
      },
    };
    await acceptDraftVaccinationConsultation.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  const personSearchFormInitialValues: PatientFormValues = {
    firstName: props.procedure.patient.firstName,
    lastName: props.procedure.patient.lastName,
    dateOfBirth: toDateString(props.procedure.patient.dateOfBirth),
    emailAddresses: props.procedure.patient.emailAddresses ?? [],
    phoneNumbers: props.procedure.patient.phoneNumbers ?? [],
    address: props.procedure.patient.address ?? "",
    countryOfBirth: props.procedure.patient.countryOfBirth ?? "",
    gender: props.procedure.patient.gender ?? ApiGender.NotSpecified,
    nameAtBirth: props.procedure.patient.nameAtBirth ?? "",
    placeOfBirth: props.procedure.patient.placeOfBirth ?? "",
    salutation:
      props.procedure.patient.salutation ?? ApiSalutation.NotSpecified,
    title: props.procedure.patient.title ?? "",
  };

  return (
    <AcceptProcedureForm
      title={"Vorgang starten"}
      onSelect={async ({ person }) => {
        let referencePersonId;
        if (instanceOfApiGetReferencePersonResponse(person)) {
          referencePersonId = person.id;
        }

        await handleCreate(props.procedure.procedureId, referencePersonId);
      }}
      submitLabel={"Vorgang starten"}
      sidebarFormRef={props.formRef}
      initialSearchState={personSearchFormInitialValues}
      addressRequired={false}
      onCancel={props.onClose}
      queryResults={props.queryResults ?? undefined}
      initialPatient={props.procedure.patient}
    />
  );
}
