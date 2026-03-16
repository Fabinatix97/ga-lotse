/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useRef, useState } from "react";

import { ApiProcedureStatus } from "@eshg/base-api";
import { LoadingIndicator, RequiresChildren } from "@eshg/lib-portal";

import { useProceduresFilterState } from "./InfectionBriefingProceduresTableFilters";

type InfectionBriefingProceduresTableFilterPreselectionWrapperProps =
  RequiresChildren;

type FilterSetup = "PENDING" | "SKIPPED" | "DONE";

export function InfectionBriefingProceduresTableFilterPreselectionWrapper(
  props: InfectionBriefingProceduresTableFilterPreselectionWrapperProps,
) {
  const stateProvider = useProceduresFilterState();
  const [preselectionStatus, setPreselectionStatus] =
    useState<FilterSetup>("PENDING");

  const displayChildren = useRef(false);

  useEffect(() => {
    if (preselectionStatus !== "PENDING") {
      return;
    }
    if (stateProvider.activeValues.length === 0) {
      stateProvider.setActiveValues([
        {
          type: "Enum",
          key: "statuses",
          selectedValues: [ApiProcedureStatus.Draft, ApiProcedureStatus.Open],
        },
      ]);
      setPreselectionStatus("DONE");
    } else {
      setPreselectionStatus("SKIPPED");
    }
  }, [preselectionStatus, stateProvider]);

  if (
    preselectionStatus === "SKIPPED" ||
    (preselectionStatus === "DONE" && stateProvider.activeValues.length > 0)
  ) {
    displayChildren.current = true;
  }
  return displayChildren.current ? props.children : <LoadingIndicator />;
}
