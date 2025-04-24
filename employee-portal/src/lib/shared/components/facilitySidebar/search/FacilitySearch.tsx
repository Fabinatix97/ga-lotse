/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import { useSearchReferenceFacilitiesQuery } from "@eshg/lib-employee-portal";
import { Button } from "@mui/joy";
import { ReactNode, useEffect, useState } from "react";

import { LegacyFacilitySearchForm } from "@/lib/shared/components/facilitySidebar/search/LegacyFacilitySearchForm";
import { LegacyFacilitySearchResults } from "@/lib/shared/components/facilitySidebar/search/LegacyFacilitySearchResults";
import { SearchFooter } from "@/lib/shared/components/facilitySidebar/search/SearchFooter";
import { SearchHeader } from "@/lib/shared/components/facilitySidebar/search/SearchHeader";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";

interface SearchMode {
  mode: "input" | "searching";
  searchTerm: string;
}

const initialSearchState: SearchMode = {
  mode: "input",
  searchTerm: "",
};

interface FacilitySearchProps {
  searchFacility?: Partial<BaseFacility>;
  searchResultsHeader?: ReactNode;
  onSelectFacility: (
    facility: ApiGetReferenceFacilityResponse,
  ) => Promise<void>;
  onCreateFacility: (facility?: Partial<BaseFacility>) => void;
  onCancel: () => void;
}

export function FacilitySearch({
  searchFacility,
  searchResultsHeader,
  onSelectFacility,
  onCreateFacility,
  onCancel,
}: Readonly<FacilitySearchProps>) {
  const [searchRequest, setSearchRequest] =
    useState<SearchMode>(initialSearchState);

  const query = useSearchReferenceFacilitiesQuery(
    {
      name: searchRequest.searchTerm.trim(),
    },
    {
      enabled: searchRequest.mode === "searching",
    },
  );

  function handleBack() {
    setSearchRequest((previous) => ({
      mode: "input",
      searchTerm: previous.searchTerm,
    }));
  }

  const header = searchResultsHeader ?? (
    <SearchHeader onBack={handleBack} search={searchRequest.searchTerm} />
  );

  const searchResult = searchFacility ?? { name: searchRequest.searchTerm };

  const footer = (
    <SearchFooter onCreateFacility={() => onCreateFacility(searchResult)} />
  );

  const cancelButton = (
    <Button
      onClick={onCancel}
      color="neutral"
      variant="soft"
      sx={{ alignSelf: "end" }}
    >
      Abbrechen
    </Button>
  );

  useEffect(() => {
    // execute a search when the 'searchFacility' property changes from outside
    if (searchFacility?.name) {
      setSearchRequest((previous) => ({
        ...previous,
        searchTerm: searchFacility?.name ?? "",
      }));
    }
  }, [searchFacility?.name]);

  return (
    <>
      {query.isSuccess && searchRequest.mode === "searching" ? (
        <LegacyFacilitySearchResults
          facilities={query.data.facilities}
          header={header}
          footer={footer}
          cancelButton={cancelButton}
          onSelectFacility={onSelectFacility}
          onCreateFacility={() => onCreateFacility(searchResult)}
        />
      ) : (
        <LegacyFacilitySearchForm
          search={searchRequest.searchTerm}
          onSubmit={(input) =>
            setSearchRequest({
              mode: "searching",
              searchTerm: input.search,
            })
          }
          cancelButton={cancelButton}
        />
      )}
    </>
  );
}
