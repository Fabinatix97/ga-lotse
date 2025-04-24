/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Tab, TabList, TabPanel, Tabs, styled } from "@mui/joy";
import { ReactNode, SyntheticEvent } from "react";

import { useExaminationStore } from "@/stores/examination/ExaminationStoreProvider";
import {
  firstToothWithDiagnosisIndex,
  lastToothWithDiagnosisIndex,
} from "@/stores/examination/actions/utils";
import {
  Dentition,
  ElementContext,
  ExaminationView,
  isExaminationView,
} from "@/stores/examination/types";

interface ExaminationJawTabsProps {
  upperJaw: ReactNode;
  lowerJaw: ReactNode;
  fullDentition: ReactNode;
}

export function ExaminationJawTabs({
  upperJaw,
  lowerJaw,
  fullDentition,
}: ExaminationJawTabsProps) {
  const currentView = useExaminationStore((state) => state.currentView);
  const setView = useExaminationStore((state) => state.setView);
  const setFocus = useExaminationStore((state) => state.setFocus);
  const dentition = useExaminationStore((state) => state.dentition);

  function handleChange(
    _: SyntheticEvent | null,
    newValue: number | string | null,
  ) {
    if (isExaminationView(newValue)) {
      setView(newValue);
      setFocus(getInitialFocusContextForView(newValue, dentition));
    }
  }

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }}>
      <JawTabs value={currentView} onChange={handleChange}>
        <JawTabList
          disableUnderline
          sx={{
            width: { xxs: "100%", md: "65%" },
            height: 40,
          }}
          aria-label="Gebiss-Ansicht"
        >
          <JawTab
            disableIndicator
            color="primary"
            variant="soft"
            value="UPPER_JAW"
          >
            Oberkiefer
          </JawTab>
          <MiddleJawTab
            disableIndicator
            color="primary"
            variant="soft"
            value="LOWER_JAW"
            currentView={currentView}
          >
            Unterkiefer
          </MiddleJawTab>
          <JawTab
            disableIndicator
            color="primary"
            variant="soft"
            value="FULL_DENTITION"
          >
            Gesamtgebiss
          </JawTab>
        </JawTabList>
        <Box
          sx={{
            overflow: "auto",
            maxWidth: "100%",
          }}
        >
          <Box sx={{ minWidth: "1161px" }}>
            <TabPanel value="UPPER_JAW">{upperJaw}</TabPanel>
            <TabPanel value="LOWER_JAW">{lowerJaw}</TabPanel>
            <TabPanel value="FULL_DENTITION">{fullDentition}</TabPanel>
          </Box>
        </Box>
      </JawTabs>
    </Stack>
  );
}

function getInitialFocusContextForView(
  view: ExaminationView,
  dentition: Dentition,
): ElementContext {
  switch (view) {
    case "UPPER_JAW":
      return {
        toothContext: {
          toothIndex: firstToothWithDiagnosisIndex(dentition.Q1.teeth),
          quadrantNumber: "Q1",
        },
        element: "mainResultField",
      };
    case "LOWER_JAW":
      return {
        toothContext: {
          toothIndex: lastToothWithDiagnosisIndex(dentition.Q3.teeth),
          quadrantNumber: "Q3",
        },
        element: "mainResultField",
      };
    case "FULL_DENTITION":
      return {
        toothContext: {
          quadrantNumber: "Q1",
          toothIndex: firstToothWithDiagnosisIndex(dentition.Q1.teeth),
        },
        element: "toothButton",
      };
  }
}

const JawTabs = styled(Tabs)(({ theme }) => ({
  maxWidth: "100%",
  alignItems: "center",
  backgroundColor: theme.palette.background.body,
}));

const JawTabList = styled(TabList)({
  display: "flex",
  borderRadius: "8px",
  overflow: "hidden",
});

const JawTab = styled(
  Tab,
  {},
)(({ theme }) => ({
  flex: "1 1 0%",
  backgroundColor: theme.palette.background.level1,
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    backgroundColor: theme.palette.focusVisible,
    color: theme.palette.background.body,
    fontWeight: theme.typography["title-md"].fontWeight,
  },
}));

const MiddleJawTab = styled(JawTab, {
  shouldForwardProp: (prop) => prop !== "currentView",
})<{ currentView: ExaminationView }>(({ theme, currentView }) => ({
  flex: "1 1 0%",
  backgroundColor: theme.palette.background.level1,
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    backgroundColor: theme.palette.focusVisible,
    color: theme.palette.background.body,
    fontWeight: theme.typography["title-md"].fontWeight,
  },

  borderLeftWidth: 1,
  borderLeftStyle: "solid",
  borderLeftColor:
    currentView === "FULL_DENTITION"
      ? "rgba(99, 107, 116, 0.3)"
      : theme.palette.focusVisible,
  borderRightWidth: 1,
  borderRightStyle: "solid",
  borderRightColor:
    currentView === "UPPER_JAW"
      ? "rgba(99, 107, 116, 0.3)"
      : theme.palette.focusVisible,
}));
