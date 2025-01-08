/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { MedicalRegistryImportButton } from "@/lib/businessModules/medicalRegistry/components/procedures/import/MedicalRegistryImportButton";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { UseFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

interface MedicalRegistryEntryOverviewControlProps {
  filterSettings: UseFilterSettings;
  toggleActivePanel: (panelName: "filters" | "entrySearch") => void;
  activePanel: "filters" | "entrySearch" | undefined;
}

export function MedicalRegistryEntryOverviewControls(
  props: MedicalRegistryEntryOverviewControlProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  return (
    <ButtonBar
      left={
        <>
          <FilterButton
            {...props.filterSettings.filterButtonProps}
            isFilterVisible={props.activePanel === "filters"}
            onClick={() => props.toggleActivePanel("filters")}
            activeFilters={
              props.activePanel !== "entrySearch"
                ? props.filterSettings.filterButtonProps.activeFilters
                : 0
            }
          />
          <Button onClick={() => props.toggleActivePanel("entrySearch")}>
            Suche
          </Button>
          {props.activePanel === "entrySearch" && (
            <SearchFilter
              tableControl={tableControl}
              searchParamName="name"
              label="Suche"
            />
          )}
        </>
      }
      right={
        <>
          <MedicalRegistryImportButton />
          <NavigationLink href={routes.procedures.create} passHref>
            <Button startDecorator={<Add />}>Eintrag erstellen</Button>
          </NavigationLink>
        </>
      }
    />
  );
}
