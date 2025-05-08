/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from "@mui/joy";
import { ReactNode, RefObject, useState } from "react";

import type { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  SidebarFormHandle,
  useSearchReferencePersonsQuery,
} from "@eshg/lib-employee-portal";

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
  sidebarFormRef?: RefObject<SidebarFormHandle | null>;
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
    <SearchHeader searchArgs={searchRequest.data} onBack={handleBack} />
  );
  const footer = (
    <SearchFooter onCreatePerson={() => onCreatePerson(searchRequest.data)} />
  );

  const cancelButton = (
    <Button
      color="neutral"
      variant="soft"
      sx={{ alignSelf: "end" }}
      onClick={() => {
        setSearchRequest(initialSearchState);
        onCancel();
      }}
    >
      Abbrechen
    </Button>
  );

  if (query.isSuccess && searchRequest.mode === "searching") {
    return (
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
    );
  }

  return (
    <LegacyPersonSearchForm
      sidebarFormRef={sidebarFormRef}
      loading={query.isLoading}
      cancelButton={cancelButton}
      title={title}
      additionalFields={personSearchFormAdditionalFields}
      initialFormValues={personSearchFormInitialValues ?? searchRequest.data}
      onSubmit={(values) =>
        setSearchRequest({
          mode: "searching",
          data: values,
        })
      }
    />
  );
}
