/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/joy";
import { Formik } from "formik";

import {
  ButtonBar,
  ToggleFilterButton,
  UseFilterSettings,
} from "@eshg/lib-employee-portal";
import { FormPlus, InputField, NavigationLink } from "@eshg/lib-portal";

import { MedicalRegistryImportButton } from "@/lib/businessModules/medicalRegistry/components/procedures/import/MedicalRegistryImportButton";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

interface MedicalRegistryEntryOverviewControlProps {
  filterSettings: UseFilterSettings;
  toggleActivePanel: (panelName: "filters" | "entrySearch") => void;
  activePanel: "filters" | "entrySearch" | undefined;
  onNameSearch: (name: string) => void;
}

export function MedicalRegistryEntryOverviewControls(
  props: MedicalRegistryEntryOverviewControlProps,
) {
  const isEntrySearch = props.activePanel === "entrySearch";

  return (
    <ButtonBar
      left={
        <Formik
          initialValues={{
            name: "",
          }}
          onSubmit={({ name }) => props.onNameSearch(name)}
        >
          <FormPlus
            sx={{
              display: "flex",
              direction: "row",
              gap: 2,
            }}
          >
            {isEntrySearch && (
              <InputField
                label={null}
                placeholder="Suche"
                aria-label="Suche"
                name="name"
                type="text"
                startDecorator={<SearchIcon />}
              />
            )}
            {!isEntrySearch && (
              <ToggleFilterButton
                {...props.filterSettings.filterButtonProps}
                isFilterVisible={props.activePanel === "filters"}
                activeFilters={
                  props.filterSettings.filterButtonProps.activeFilters
                }
                onClick={() => props.toggleActivePanel("filters")}
              />
            )}
            {!isEntrySearch && (
              <Button onClick={() => props.toggleActivePanel("entrySearch")}>
                Suche
              </Button>
            )}
            {isEntrySearch && <Button type="submit">Suchen</Button>}
            {isEntrySearch && (
              <Button
                variant="outlined"
                onClick={() => props.toggleActivePanel("entrySearch")}
              >
                Abbrechen
              </Button>
            )}
          </FormPlus>
        </Formik>
      }
      right={
        !isEntrySearch && (
          <>
            <MedicalRegistryImportButton />
            <NavigationLink href={routes.procedures.create} passHref>
              <Button startDecorator={<Add />}>Eintrag erstellen</Button>
            </NavigationLink>
          </>
        )
      }
    />
  );
}
