/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button, Stack, ToggleButtonGroup } from "@mui/joy";
import { MouseEvent, ReactNode } from "react";

import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { DentalExaminationView } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface DentalExaminationJawTabsProps {
  upperJaw: ReactNode;
  lowerJaw: ReactNode;
  fullDentition: ReactNode;
}

export function DentalExaminationJawTabs({
  upperJaw,
  lowerJaw,
  fullDentition,
}: DentalExaminationJawTabsProps) {
  const currentView = useDentalExaminationStore((state) => state.currentView);
  const setView = useDentalExaminationStore((state) => state.setView);

  function getCurrentContent(view: DentalExaminationView) {
    switch (view) {
      case "UPPER_JAW":
        return upperJaw;
      case "LOWER_JAW":
        return lowerJaw;
      case "FULL_DENTITION":
        return fullDentition;
    }
  }

  function handleChange(
    _: MouseEvent<HTMLElement>,
    newValue: DentalExaminationView | null,
  ) {
    if (newValue !== null) {
      setView(newValue);
    }
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <ToggleButtonGroup
        variant="tabs"
        color="primary"
        size="md"
        value={currentView}
        onChange={handleChange}
        sx={{
          width: { xxs: "100%", md: "65%" },
          display: "flex",
        }}
        aria-label="Gebiss-Ansicht"
      >
        <Button sx={{ flex: "1 1 0%" }} value="UPPER_JAW">
          Oberkiefer
        </Button>
        <Button sx={{ flex: "1 1 0%" }} value="LOWER_JAW">
          Unterkiefer
        </Button>
        <Button sx={{ flex: "1 1 0%" }} value="FULL_DENTITION">
          Gesamtgebiss
        </Button>
      </ToggleButtonGroup>
      <Box
        sx={{
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ minWidth: "1121px" }}>{getCurrentContent(currentView)}</Box>
      </Box>
    </Stack>
  );
}
