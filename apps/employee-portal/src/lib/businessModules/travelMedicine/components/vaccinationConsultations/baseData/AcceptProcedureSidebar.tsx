/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  SearchPersonFormValues,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue, toDateString } from "@eshg/lib-portal";
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

export function useAcceptProcedureSidebar(): UseSidebarWithFormRefResult<AcceptProcedureSidebarProps> {
  return useSidebarWithFormRef({
    component: AcceptProcedureSidebar,
  });
}

interface AcceptProcedureSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiGetVaccinationConsultationDetailsResponse;
  queryResults?: ApiGetReferencePersonResponse[];
}

interface PatientFormValues extends SearchPersonFormValues {
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
      title="Vorgang starten"
      submitLabel="Vorgang starten"
      sidebarFormRef={props.formRef}
      initialSearchState={personSearchFormInitialValues}
      addressRequired={false}
      queryResults={props.queryResults ?? undefined}
      initialPatient={props.procedure.patient}
      onSelect={async ({ person }) => {
        let referencePersonId;
        if (instanceOfApiGetReferencePersonResponse(person)) {
          referencePersonId = person.id;
        }

        await handleCreate(props.procedure.procedureId, referencePersonId);
      }}
      onCancel={props.onClose}
    />
  );
}
