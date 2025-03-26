/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  mapApiAddressToForm,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  AcceptDraftProcedureRequest,
  ApiAffectedPerson,
  ApiAffectedPersonContactAddress,
  ApiCountryCode,
  ApiEmployeeOmsProcedureDetails,
  ApiGender,
  ApiSalutation,
} from "@eshg/official-medical-service-api";

import { useAcceptDraftProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { StartProcedureForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/StartProcedureForm";
import { mapPerson } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { SearchPersonFormValues } from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";

export function useStartProcedureSidebar(): UseSidebarWithFormRefResult<StartProcedureSidebarProps> {
  return useSidebarWithFormRef({ component: StartProcedureSidebar });
}

interface StartProcedureSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
  queryResults?: ApiGetReferencePersonResponse[];
}

export interface PatientFormValues extends SearchPersonFormValues {
  emailAddresses: OptionalFieldValue<string>[];
  phoneNumbers: OptionalFieldValue<string>[];
  address: OptionalFieldValue<ApiAffectedPersonContactAddress>;
  countryOfBirth: OptionalFieldValue<ApiCountryCode>;
  gender: OptionalFieldValue<ApiGender>;
  nameAtBirth: OptionalFieldValue<string>;
  placeOfBirth: OptionalFieldValue<string>;
  salutation: OptionalFieldValue<ApiSalutation>;
  title: OptionalFieldValue<string>;
}

export function instanceOfApiGetReferencePersonResponse(
  data:
    | ApiGetReferencePersonResponse
    | ApiAffectedPerson
    | DefaultPersonFormValues,
): data is ApiGetReferencePersonResponse {
  return "id" in data;
}

function StartProcedureSidebar(props: Readonly<StartProcedureSidebarProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const acceptDraftProcedure = useAcceptDraftProcedure();

  function handleCreate(
    newAffectedPeron?: ApiAffectedPerson,
    referencePersonId?: string,
  ) {
    const request: AcceptDraftProcedureRequest = {
      id: props.procedure.id,
      apiPatchAcceptDraftProcedureRequest: {
        affectedPerson: newAffectedPeron ?? undefined,
        referencePersonId: referencePersonId ?? undefined,
      },
    };
    openConfirmationDialog({
      onConfirm: async () => {
        await acceptDraftProcedure.mutateAsync(request, {
          onSuccess: () => {
            props.onClose(true);
          },
        });
      },
      confirmLabel: "Anlegen",
      title: "Vorgang anlegen?",
      description: "Der Vorgang erhält den Status “Offen”.",
    });
  }

  const personSearchFormInitialValues: PatientFormValues = {
    firstName: props.procedure.affectedPerson.firstName,
    lastName: props.procedure.affectedPerson.lastName,
    dateOfBirth: toDateString(props.procedure.affectedPerson.dateOfBirth),
    emailAddresses: props.procedure.affectedPerson.emailAddresses ?? [],
    phoneNumbers: props.procedure.affectedPerson.phoneNumbers ?? [],
    address: props.procedure.affectedPerson.contactAddress ?? "",
    countryOfBirth: props.procedure.affectedPerson.countryOfBirth ?? "",
    gender: props.procedure.affectedPerson.gender ?? ApiGender.NotSpecified,
    nameAtBirth: props.procedure.affectedPerson.nameAtBirth ?? "",
    placeOfBirth: props.procedure.affectedPerson.placeOfBirth ?? "",
    salutation:
      props.procedure.affectedPerson.salutation ?? ApiSalutation.NotSpecified,
    title: props.procedure.affectedPerson.title ?? "",
  };

  function defaultPersonFormValues(): DefaultPersonFormValues {
    return {
      firstName: props.procedure.affectedPerson.firstName,
      lastName: props.procedure.affectedPerson.lastName,
      dateOfBirth: toDateString(props.procedure.affectedPerson.dateOfBirth),
      emailAddresses: props.procedure.affectedPerson.emailAddresses ?? [],
      phoneNumbers: props.procedure.affectedPerson.phoneNumbers ?? [],
      contactAddress:
        mapApiAddressToForm(props.procedure.affectedPerson.contactAddress) ??
        "",
      countryOfBirth: props.procedure.affectedPerson.countryOfBirth ?? "",
      gender: props.procedure.affectedPerson.gender ?? ApiGender.NotSpecified,
      nameAtBirth: props.procedure.affectedPerson.nameAtBirth ?? "",
      placeOfBirth: props.procedure.affectedPerson.placeOfBirth ?? "",
      salutation:
        props.procedure.affectedPerson.salutation ?? ApiSalutation.NotSpecified,
      title: props.procedure.affectedPerson.title ?? "",
    };
  }

  return (
    <StartProcedureForm
      title={"Vorgang anlegen"}
      onSelect={async ({ person }) => {
        let referencePersonId;
        if (instanceOfApiGetReferencePersonResponse(person)) {
          referencePersonId = person.id;
          handleCreate(undefined, referencePersonId);
        } else {
          handleCreate(mapPerson(person as ApiGetReferencePersonResponse));
        }
        return Promise.resolve();
      }}
      submitLabel={"Vorgang starten"}
      sidebarFormRef={props.formRef}
      initialSearchState={personSearchFormInitialValues}
      initialCreateState={defaultPersonFormValues}
      addressRequired={true}
      onCancel={props.onClose}
      queryResults={props.queryResults ?? undefined}
      initialAffectedPerson={props.procedure.affectedPerson}
    />
  );
}
