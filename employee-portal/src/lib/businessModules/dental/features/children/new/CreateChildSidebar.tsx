/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAddContact200Response } from "@eshg/base-api";
import { ApiCreateChildRequest } from "@eshg/dental-api";
import { routes } from "@eshg/dental/shared/routes";
import { ApiCreatePerson } from "@eshg/employee-portal-api/schoolEntry";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { useCreateChild } from "@/lib/businessModules/dental/api/mutations/childApi";
import { getChildrenByPersonQuery } from "@/lib/businessModules/dental/api/queries/childApi";
import { ChildProcedureCard } from "@/lib/businessModules/dental/features/children/new/ChildProcedureCard";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { SelectContactField } from "@/lib/shared/components/formFields/SelectContactField";
import { SchoolYearField } from "@/lib/shared/components/formFields/schoolYear";
import { PersonSidebar } from "@/lib/shared/components/personSidebar/PersonSidebar";
import { mapToPersonAddRequest } from "@/lib/shared/components/personSidebar/helpers";
import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonForm";
import { DefaultSearchPersonFormFields } from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonFormFields";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { getInstitutionOptionLabel } from "@/lib/shared/helpers/selectOptionMapper";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface DentalSearchForm extends SearchPersonFormValues {
  schoolYear: OptionalFieldValue<number>;
  institution: ApiAddContact200Response | null;
  groupName: OptionalFieldValue<string>;
}

const personSearchFormInitialValues: DentalSearchForm = {
  ...defaultSearchPersonValues(),
  schoolYear: "",
  institution: null,
  groupName: "",
};

function DentalSearchFormComponent(
  props: SearchPersonFormProps<DentalSearchForm>,
) {
  return (
    <DefaultSearchPersonForm {...props}>
      <SchoolYearField
        name="schoolYear"
        label="Wählen Sie ein Schuljahr aus"
        required="Bitte ein Schuljahr angeben."
        range={{
          numberOfYearsInPast: 1,
          numberOfYearsInFuture: 1,
        }}
      />
      <SelectContactField
        name="institution"
        label="Einrichtung"
        categories={SCHOOL_OR_DAYCARE}
        required="Bitte eine Schule/Kita angeben."
        getOptionLabel={getInstitutionOptionLabel}
      />
      <SearchGroupField
        name="groupName"
        label="Wählen Sie eine Gruppe aus"
        institutionId={props.values.institution?.id ?? ""}
        freeSolo
      />
      <DefaultSearchPersonFormFields />
    </DefaultSearchPersonForm>
  );
}

export function CreateChildSidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const createChild = useCreateChild();
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const { openCancelDialog } = useConfirmationDialog();

  function closeSidebar() {
    setOpen(false);
  }

  function handleClose() {
    if (sidebarFormRef.current?.dirty) {
      openCancelDialog({
        onConfirm: closeSidebar,
      });
    } else {
      closeSidebar();
    }
  }

  async function handleCreate(
    child: ApiCreatePerson,
    schoolYear: OptionalFieldValue<number>,
    institutionId: OptionalFieldValue<string>,
    groupName: OptionalFieldValue<string>,
  ) {
    await createChild.mutateAsync(
      mapToCreateChildRequest(child, schoolYear, institutionId, groupName),
      {
        onSuccess: (response) => {
          closeSidebar();
          router.push(routes.children.byId(response.id).details);
        },
      },
    );
  }

  const childApi = useChildApi();
  return (
    <>
      <Button
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
        size={BUTTON_SIZE}
      >
        Neues Kind anlegen
      </Button>

      <Sidebar open={open} onClose={handleClose}>
        {open && (
          <PersonSidebar
            title={"Neues Kind anlegen"}
            onCancel={handleClose}
            onCreate={async ({ searchInputs, createInputs }) => {
              await handleCreate(
                mapToPersonAddRequest(createInputs),
                searchInputs.schoolYear,
                searchInputs.institution?.id ?? "",
                searchInputs.groupName,
              );
            }}
            onSelect={async ({ searchInputs, person }) => {
              await handleCreate(
                mapToPersonAddRequest(person),
                searchInputs.schoolYear,
                searchInputs.institution?.id ?? "",
                searchInputs.groupName,
              );
            }}
            submitLabel={"Kind anlegen"}
            sidebarFormRef={sidebarFormRef}
            searchFormComponent={DentalSearchFormComponent}
            initialSearchState={personSearchFormInitialValues}
            addressRequired
            associatedProcedures={{
              getQuery: (personId) =>
                getChildrenByPersonQuery(childApi, personId),
              cardComponent: ChildProcedureCard,
            }}
          />
        )}
      </Sidebar>
    </>
  );
}

function mapToCreateChildRequest(
  child: ApiCreatePerson,
  schoolYear: OptionalFieldValue<number>,
  institutionId: OptionalFieldValue<string>,
  groupName: OptionalFieldValue<string>,
): ApiCreateChildRequest {
  return {
    ...child,
    year: mapRequiredValue(schoolYear),
    institutionId: mapRequiredValue(institutionId),
    groupName: mapRequiredValue(groupName),
  };
}
