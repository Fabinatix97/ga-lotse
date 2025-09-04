/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Search } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { Formik } from "formik";
import { JSX, ReactNode } from "react";

import { FormPlus, InputField } from "@eshg/lib-portal";

import { ToggleFilterButton as GenericFilterButton } from "../../features/filters/components/filterSettings/ToggleFilterButton";
import { UseFilterSettings } from "../../features/filters/hooks/useFilterSettings";
import { ButtonBar } from "../buttons/ButtonBar";

export type TableControlName = "filters" | "entrySearch";

const SEARCH_INPUT_MAX_WIDTH = 584;

export function reduceActiveTableControl(
  state: TableControlName | undefined,
  newState: TableControlName,
): TableControlName | undefined {
  return newState === state ? undefined : newState;
}

interface ProceduresTableControlsProps {
  onEntrySearch: (searchTerm: string) => void;
  onToggleActiveTableControl: (tableControl: TableControlName) => void;
  activeTableControl: TableControlName | undefined;
  controlsRight?: ReactNode;
  filterSettings?: UseFilterSettings;
  ToggleFilterButton?: JSX.Element;
}

export function ProceduresTableControls({
  onEntrySearch,
  onToggleActiveTableControl,
  activeTableControl,
  controlsRight = null,
  filterSettings,
  ToggleFilterButton,
}: ProceduresTableControlsProps) {
  const isEntrySearch = activeTableControl === "entrySearch";

  function renderFilterButton() {
    let filterButton = null;

    if (ToggleFilterButton) {
      filterButton = ToggleFilterButton;
    } else if (filterSettings) {
      filterButton = (
        <GenericFilterButton
          {...filterSettings.filterButtonProps}
          isFilterVisible={activeTableControl === "filters"}
          activeFilters={filterSettings.filterButtonProps.activeFilters}
          onClick={() => onToggleActiveTableControl("filters")}
        />
      );
    }

    return filterButton;
  }

  return (
    <ButtonBar
      left={
        <Formik
          initialValues={{
            searchTerm: "",
          }}
          onSubmit={({ searchTerm }) => onEntrySearch(searchTerm)}
        >
          {({ setFieldValue }) => (
            <FormPlus
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flex: 1,
                gap: 2,
              }}
            >
              {!isEntrySearch ? (
                <>
                  {renderFilterButton()}
                  <Button
                    aria-label="Filter verbergen und Suche anzeigen"
                    onClick={() => onToggleActiveTableControl("entrySearch")}
                  >
                    Suche
                  </Button>
                </>
              ) : (
                <>
                  <InputField
                    label={null}
                    placeholder="Suche"
                    aria-label="Suche"
                    name="searchTerm"
                    type="text"
                    startDecorator={<Search />}
                    sx={{
                      flex: 1,
                      maxWidth: SEARCH_INPUT_MAX_WIDTH,
                    }}
                  />
                  <Button type="submit">Suchen</Button>
                  <Button
                    variant="outlined"
                    aria-label="Suche verbergen und Filter anzeigen"
                    onClick={() => {
                      onToggleActiveTableControl("entrySearch");
                      onEntrySearch("");
                      void setFieldValue("searchTerm", "");
                    }}
                  >
                    Abbrechen
                  </Button>
                </>
              )}
            </FormPlus>
          )}
        </Formik>
      }
      right={!isEntrySearch && controlsRight}
    />
  );
}
