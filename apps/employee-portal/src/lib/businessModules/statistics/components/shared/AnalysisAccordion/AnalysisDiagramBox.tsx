/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button, Divider, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

interface AnalysisDiagramProps {
  description: string | undefined;
  filterLabels: string[];
  evaluatedDataAmount: number;
  evaluatedDataAmountTotal: number;
  header?: ReactNode;
  getChart: () => ReactNode;
  onShowMoreDescription?: () => void;
}

export function AnalysisDiagramBox({
  description,
  filterLabels,
  evaluatedDataAmount,
  evaluatedDataAmountTotal,
  header,
  getChart,
  onShowMoreDescription,
}: AnalysisDiagramProps) {
  function diagramContent() {
    if (evaluatedDataAmount === 0) {
      return (
        <Box
          height="100%"
          width="100%"
          alignContent="center"
          textAlign="center"
        >
          <Typography level="body-md" color="primary">
            Keine Daten vorhanden
          </Typography>
        </Box>
      );
    }
    return getChart();
  }

  return (
    <Stack
      flex="1"
      display="flex"
      minWidth={0}
      data-testid="analysis-diagram"
      sx={{
        minHeight: "31rem",
        borderRadius: "sm",
        padding: 2,
        backgroundColor: "background.level1",
      }}
    >
      {header}
      {diagramContent()}
      <Stack gap={2}>
        <Divider />
        <Description
          description={description}
          onShowMoreDescription={onShowMoreDescription}
        />
        <Stack gap={0.5}>
          <Typography
            level="body-xs"
            textColor="text.secondary"
            data-testid="analysis-diagram-filter"
          >
            Filter: {filterLabels.join(" | ")}
          </Typography>
          <Typography
            level="body-xs"
            textColor="text.secondary"
            data-testid="analysis-diagram-evaluated-data"
          >
            {`Ausgewertete Daten: ${evaluatedDataAmount} von ${evaluatedDataAmountTotal}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

function Description(props: {
  description: string | undefined;
  onShowMoreDescription?: () => void;
}) {
  if (props.onShowMoreDescription) {
    const MAX_DESCRIPTION_LENGTH = 95; // Determined through testing
    const showMore = (props.description?.length ?? 0) > MAX_DESCRIPTION_LENGTH;

    return (
      <Typography
        sx={{ height: "4rem" }}
        level="body-md"
        data-testid="analysis-diagram-description"
      >
        {props.description?.slice(0, MAX_DESCRIPTION_LENGTH)}
        {showMore && "..."}
        {showMore && (
          <Button
            variant="plain"
            onClick={() => props.onShowMoreDescription!()}
          >
            Mehr anzeigen
          </Button>
        )}
      </Typography>
    );
  } else {
    return (
      <Typography
        sx={{
          height: "10rem",
          overflowY: "scroll",
        }}
        level="body-md"
        data-testid="analysis-diagram-description"
      >
        {props.description}
      </Typography>
    );
  }
}
