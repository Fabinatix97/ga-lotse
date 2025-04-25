/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/joy";
import { Formik } from "formik";
import { JSX, ReactNode } from "react";

import {
  ButtonBar,
  ToggleFilterButton as GenericFilterButton,
  UseFilterSettings,
} from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

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
          onClick={() => onToggleActiveTableControl("filters")}
          activeFilters={filterSettings.filterButtonProps.activeFilters}
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
                    startDecorator={<SearchIcon />}
                    sx={{
                      flex: 1,
                      maxWidth: SEARCH_INPUT_MAX_WIDTH,
                    }}
                  />
                  <Button type="submit">Suchen</Button>
                  <Button
                    variant="outlined"
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
