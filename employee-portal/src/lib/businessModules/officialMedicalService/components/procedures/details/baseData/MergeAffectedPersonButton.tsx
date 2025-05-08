/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

import {
  ApiGetReferencePersonResponse,
  ApiPersonContact,
  ApiSearchReferencePersonsResponse,
} from "@eshg/base-api";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonSearchResults,
  PersonSidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  mapToPersonUpdateRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  ApiAffectedPerson,
  ApiEmployeeOmsProcedureDetails,
} from "@eshg/official-medical-service-api";

import {
  mapOptionalMergeValue,
  mapRequiredMergeValue,
} from "@/lib/baseModule/components/contacts/forms/helpers";
import { MergePersonContactForm } from "@/lib/baseModule/components/contacts/forms/merge/MergePersonContactForm";
import {
  MergePersonContactFormValues,
  PersonContactWithNameAtBirth,
} from "@/lib/baseModule/components/contacts/types";
import { useMergeAffectedPerson } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  mapPersonDetailsToForm,
  mapToAffectedPersonWithVersionNumber,
} from "@/lib/businessModules/officialMedicalService/shared/helpers";

type SidebarMode = "create" | "search_results" | "merge";

export function useMergeAffectedPersonSidebar(): UseSidebarWithFormRefResult<MergeAffectedPersonSidebarProps> {
  return useSidebarWithFormRef({ component: MergeAffectedPersonSidebar });
}

interface MergeAffectedPersonSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
  searchReferencePersonsQuery: UseQueryResult<ApiSearchReferencePersonsResponse>;
}

interface SidebarState {
  mode: SidebarMode;
  selectedPerson?: ApiGetReferencePersonResponse;
}

function getInitialState(
  persons: ApiGetReferencePersonResponse[],
): SidebarState {
  return {
    mode: persons.length > 0 ? "search_results" : "create",
  };
}

function MergeAffectedPersonSidebar(props: MergeAffectedPersonSidebarProps) {
  const mergePerson = useMergeAffectedPerson();

  const [state, setState] = useState(
    getInitialState(props.searchReferencePersonsQuery.data!.persons),
  );

  async function handleSubmit(values: DefaultPersonFormValues) {
    await mergePerson.mutateAsync({
      id: props.procedure.id,
      apiMergeAffectedPersonRequest: {
        affectedPerson: mapToAffectedPersonWithVersionNumber(
          mapToPersonUpdateRequest(values, 0),
        ),
        mergeInto: undefined,
      },
    });
    props.onClose(true);
  }

  async function handleSubmitMerge(values: MergePersonContactFormValues) {
    await mergePerson.mutateAsync({
      id: props.procedure.id,
      apiMergeAffectedPersonRequest: {
        affectedPerson: mapToAffectedPersonWithVersionNumber(
          mapToPersonUpdateRequest(
            {
              ...values,
              placeOfBirth: props.procedure.affectedPerson.placeOfBirth ?? "",
              countryOfBirth:
                props.procedure.affectedPerson.countryOfBirth ?? "",
              lastName: mapRequiredMergeValue(values.name).trim(),
              dateOfBirth:
                toDateString(props.procedure.affectedPerson.dateOfBirth) ?? "",
              gender: mapRequiredMergeValue(values.gender),
              salutation: mapRequiredMergeValue(values.salutation),
              title: mapRequiredMergeValue(values.title).trim(),
              firstName: mapRequiredMergeValue(values.firstName).trim(),
              nameAtBirth:
                mapOptionalMergeValue(values.nameAtBirth)?.trim() ?? "",
            },
            0,
          ),
        ),
        mergeInto: state.selectedPerson!.id,
      },
    });
    props.onClose(true);
  }

  if (state.mode === "search_results") {
    return (
      <PersonSearchResults
        persons={props.searchReferencePersonsQuery.data!.persons}
        inputs={{
          firstName: props.procedure.affectedPerson.firstName,
          lastName: props.procedure.affectedPerson.lastName,
          dateOfBirth: formatDate(props.procedure.affectedPerson.dateOfBirth),
        }}
        sidebarFormRef={props.formRef}
        title="Person vorhanden"
        externalPerson
        extendExistingContactText="Vorhandene Person erweitern:"
        onCancel={props.onClose}
        onCreatePerson={props.onClose} // We don't use the create button here, so it doesn't matter what we put here
        onSelectPerson={(person) => {
          if (person?.id) {
            setState({ mode: "merge", selectedPerson: person });
          } else {
            setState({ mode: "create" });
          }
        }}
      />
    );
  }
  if (state.mode === "create") {
    return (
      <PersonSidebarForm
        title="Personendaten anlegen"
        sidebarFormRef={props.formRef}
        component={DefaultPersonForm}
        initialValues={mapPersonDetailsToForm(props.procedure.affectedPerson)}
        mode="edit"
        submitLabel="Anlegen"
        onCancel={props.onClose}
        onSubmit={handleSubmit}
      />
    );
  }
  if (state.mode === "merge") {
    return (
      <MergePersonContactForm
        from={{
          type: "Entity",
          data: mapApiAffectedPersonToApiPersonContact(
            props.procedure.affectedPerson,
            props.procedure.id,
          ),
        }}
        fromLabel="Person aus Vorgang"
        into={mapApiGetReferencePersonResponseToApiPersonContact(
          state.selectedPerson!,
        )}
        intoLabel="Person aus Liste"
        sidebarFormRef={props.formRef}
        withNameAtBirth
        onCancel={props.onClose}
        onSuccess={() => props.onClose(true)}
        onSubmit={handleSubmitMerge}
      />
    );
  }
}

function mapApiGetReferencePersonResponseToApiPersonContact(
  person: ApiGetReferencePersonResponse,
): ApiPersonContact {
  return {
    ...person,
    emailAddresses: normalizeListInputsForApiPersonContact(
      person.emailAddresses,
    ),
    name: person.lastName,
    phoneNumbers: normalizeListInputsForApiPersonContact(person.phoneNumbers),
    type: "PersonContact",
  };
}

function mapApiAffectedPersonToApiPersonContact(
  person: ApiAffectedPerson,
  id: string,
): PersonContactWithNameAtBirth {
  return {
    ...person,
    emailAddresses: normalizeListInputsForApiPersonContact(
      person.emailAddresses,
    ),
    id: id,
    name: person.lastName,
    phoneNumbers: normalizeListInputsForApiPersonContact(person.phoneNumbers),
    type: "PersonContact",
  };
}

function normalizeListInputsForApiPersonContact(
  input: string[] | undefined,
): string[] {
  return input === undefined || input.length === 0 ? [] : input;
}
