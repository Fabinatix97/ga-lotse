/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { Button } from "@mui/joy";
import { ReactNode, RefObject, useState } from "react";

import { useSearchReferencePersonsQuery } from "@/lib/baseModule/api/queries/persons";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import {
  LegacyMinimalPerson,
  MINIMAL_PERSON_VALUES,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import { LegacyPersonSearchForm } from "@/lib/shared/components/legacyPersonSidebar/search/LegacyPersonSearchForm";
import { LegacyPersonSearchResults } from "@/lib/shared/components/legacyPersonSidebar/search/LegacyPersonSearchResults";
import { SearchFooter } from "@/lib/shared/components/legacyPersonSidebar/search/SearchFooter";
import { SearchHeader } from "@/lib/shared/components/legacyPersonSidebar/search/SearchHeader";

interface LegacyPersonSearchProps {
  onSelectPerson: (person: ApiGetReferencePersonResponse) => Promise<void>;
  onCreatePerson: (person: LegacyMinimalPerson) => void;
  onCancel: () => void;
  title: string;
  personSearchFormAdditionalFields?: () => ReactNode;
  personSearchFormInitialValues?: LegacyMinimalPerson;
  sidebarFormRef?: RefObject<SidebarFormHandle>;
}

interface SearchMode {
  mode: "input" | "searching";
  data: LegacyMinimalPerson;
}

const initialSearchState = {
  mode: "input",
  data: MINIMAL_PERSON_VALUES,
} as const satisfies SearchMode;

export function LegacyPersonSearch({
  onSelectPerson,
  onCreatePerson,
  onCancel,
  title,
  personSearchFormAdditionalFields,
  personSearchFormInitialValues,
  sidebarFormRef,
}: LegacyPersonSearchProps) {
  const [searchRequest, setSearchRequest] =
    useState<SearchMode>(initialSearchState);

  const query = useSearchReferencePersonsQuery(
    {
      firstName: searchRequest.data.firstName.trim(),
      lastName: searchRequest.data.lastName.trim(),
      dateOfBirth: new Date(searchRequest.data.dateOfBirth.trim()),
    },
    {
      enabled: searchRequest.mode === "searching",
    },
  );

  function handleBack() {
    setSearchRequest((previous) => ({
      mode: "input",
      data: previous.data,
    }));
  }

  const header = (
    <SearchHeader onBack={handleBack} searchArgs={searchRequest.data} />
  );
  const footer = (
    <SearchFooter onCreatePerson={() => onCreatePerson(searchRequest.data)} />
  );

  const cancelButton = (
    <Button
      onClick={() => {
        setSearchRequest(initialSearchState);
        onCancel();
      }}
      color="neutral"
      variant="soft"
      sx={{ alignSelf: "end" }}
    >
      Abbrechen
    </Button>
  );

  return (
    <>
      {query.isSuccess && searchRequest.mode === "searching" ? (
        <LegacyPersonSearchResults
          title={title}
          header={header}
          footer={footer}
          persons={query.data?.persons}
          onCancel={() => {
            setSearchRequest(initialSearchState);
            onCancel();
          }}
          onSelectPerson={onSelectPerson}
          onCreatePerson={() => onCreatePerson(searchRequest.data)}
        />
      ) : (
        <LegacyPersonSearchForm
          sidebarFormRef={sidebarFormRef}
          onSubmit={(values) =>
            setSearchRequest({
              mode: "searching",
              data: values,
            })
          }
          loading={query.isLoading}
          cancelButton={cancelButton}
          title={title}
          additionalFields={personSearchFormAdditionalFields}
          initialFormValues={
            personSearchFormInitialValues ?? searchRequest.data
          }
        />
      )}
    </>
  );
}
