/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import {
  ButtonBar,
  TogglePersonSearchButton,
  usePersonSearchFromURL,
} from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal";

import { InfectionBriefingProceduresTableFilterButton } from "./InfectionBriefingProceduresTableFilters";

export type TableControlName = "filters" | "personSearch";

interface InfectionBriefingProceduresTableControlsProps {
  onToggleActiveTableControl: (tableControl: TableControlName) => void;
  filtersPanelId: string;
  activeTableControl: TableControlName | null;
}

export function InfectionBriefingProceduresTableControls({
  onToggleActiveTableControl,
  filtersPanelId,
  activeTableControl,
}: InfectionBriefingProceduresTableControlsProps) {
  const personSearch = usePersonSearchFromURL();

  return (
    <ButtonBar
      left={
        <Row role="tablist">
          <InfectionBriefingProceduresTableFilterButton
            role="tab"
            aria-controls={filtersPanelId}
            aria-expanded={activeTableControl === "filters"}
          />
          <TogglePersonSearchButton
            role="tab"
            {...personSearch.buttonProps}
            aria-expanded={activeTableControl === "personSearch"}
            expanded={activeTableControl === "personSearch"}
            onClick={() => onToggleActiveTableControl("personSearch")}
          />
        </Row>
      }
      right={
        <Button
          autoFocus
          startDecorator={<Add />}
          disabled
          onClick={() => {
            throw new Error("Not supported yet!");
          }}
        >
          Neuen Vorgang anlegen
        </Button>
      }
      invertDomOrder
    />
  );
}
