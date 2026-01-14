/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { ReactElement } from "react";

import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { SelectDiagramStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SelectDiagramStep/selectDiagramStepFormModel";
import {
  diagramTypeIcons,
  diagramTypeNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { SelectableCardsField } from "@/lib/shared/components/formFields/SelectableCardsField";

function DiagramSelectableCard({ diagramType }: { diagramType: DiagramType }) {
  const DiagramTypeIcon = diagramTypeIcons[diagramType];
  return (
    <Stack direction="row" justifyContent="space-between" flex="1">
      <Typography level="title-md">{diagramTypeNames[diagramType]}</Typography>
      <DiagramTypeIcon />
    </Stack>
  );
}

export function SelectDiagramStep(
  props: SidebarStepContentProps<SelectDiagramStepFormModel>,
) {
  const options: {
    value: DiagramType;
    content: ReactElement;
  }[] = [
    {
      value: DiagramType.BAR_CHART,
      content: <DiagramSelectableCard diagramType={DiagramType.BAR_CHART} />,
    },
    {
      value: DiagramType.CHOROPLETH_CHART,
      content: (
        <DiagramSelectableCard diagramType={DiagramType.CHOROPLETH_CHART} />
      ),
    },
    {
      value: DiagramType.HISTOGRAM_CHART,
      content: (
        <DiagramSelectableCard diagramType={DiagramType.HISTOGRAM_CHART} />
      ),
    },
    {
      value: DiagramType.PIE_CHART,
      content: <DiagramSelectableCard diagramType={DiagramType.PIE_CHART} />,
    },
    {
      value: DiagramType.LINE_CHART,
      content: <DiagramSelectableCard diagramType={DiagramType.LINE_CHART} />,
    },
    {
      value: DiagramType.SCATTER_CHART,
      content: (
        <DiagramSelectableCard diagramType={DiagramType.SCATTER_CHART} />
      ),
    },
  ];

  return (
    <>
      <Typography
        level="body-md"
        sx={{ paddingBottom: 2 }}
        id="presentation-label"
      >
        Wie soll die Analyse dargestellt werden?
      </Typography>

      <SelectableCardsField
        name={props.fieldName("diagramType")}
        required="Bitte Darstellungsform wählen."
        options={options}
        aria-labelledby="presentation-label"
      />
    </>
  );
}
