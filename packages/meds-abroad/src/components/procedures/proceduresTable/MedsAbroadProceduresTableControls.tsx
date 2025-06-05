/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { Formik } from "formik";
import { JSX } from "react";

import {
  ButtonBar,
  ToggleFilterButton as GenericFilterButton,
  UseFilterSettings,
} from "@eshg/lib-employee-portal";
import { FormPlus, NavigationLink } from "@eshg/lib-portal";

import { useAddNewProcedureSidebar } from "../sidebar/useAddNewProcedureSidebar";

export type TableControlName = "filters" | "personSearch";

export function reduceActiveTableControl(
  state: TableControlName | undefined,
  newState: TableControlName,
): TableControlName | undefined {
  return newState === state ? undefined : newState;
}

interface MedsAbroadProceduresTableControlsProps {
  onPersonSearch?: (searchTerm: string) => void;
  onToggleActiveTableControl: (tableControl: TableControlName) => void;
  activeTableControl: TableControlName | undefined;
  filterSettings?: UseFilterSettings;
  ToggleFilterButton?: JSX.Element;
}

export function MedsAbroadProceduresTableControls({
  onPersonSearch,
  onToggleActiveTableControl,
  activeTableControl,
  filterSettings,
  ToggleFilterButton,
}: MedsAbroadProceduresTableControlsProps) {
  const isPersonSearch = activeTableControl === "personSearch";
  const link = useAddNewProcedureSidebar();

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
          onSubmit={({ searchTerm }) => {
            if (onPersonSearch) {
              onPersonSearch(searchTerm);
            }
          }}
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
              {!isPersonSearch ? (
                <>
                  {renderFilterButton()}
                  <Button
                    onClick={() => onToggleActiveTableControl("personSearch")}
                  >
                    Suche
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => {
                    onToggleActiveTableControl("personSearch");
                    if (onPersonSearch) {
                      onPersonSearch("");
                    }
                    void setFieldValue("searchTerm", "");
                  }}
                >
                  Abbrechen
                </Button>
              )}
            </FormPlus>
          )}
        </Formik>
      }
      right={
        !isPersonSearch && <ControlsRight openNewProcedureSidebarLink={link} />
      }
    />
  );
}

function ControlsRight({
  openNewProcedureSidebarLink,
}: {
  openNewProcedureSidebarLink: string;
}) {
  return (
    <NavigationLink href={openNewProcedureSidebarLink} passHref>
      <Button startDecorator={<Add />}>Neuen Vorgang anlegen</Button>
    </NavigationLink>
  );
}
