/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Sheet,
  Stack,
} from "@mui/joy";
import { ReactNode } from "react";

interface AccordionSheetProps {
  summary: ReactNode;
  controls?: ReactNode;
  details: ReactNode;
  expanded: boolean;
  onExpand: (expanded: boolean) => void;
}

export function AccordionSheet(props: AccordionSheetProps) {
  return (
    <Sheet
      sx={{
        borderRadius: "lg",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      data-testid="analysis-accordion-sheet"
    >
      <AccordionGroup>
        <Accordion
          sx={{ padding: 0 }}
          expanded={props.expanded}
          onChange={(_, expanded) => {
            props.onExpand(expanded);
          }}
        >
          <Stack
            direction="row"
            gap={2}
            data-testid="analysis-accordion-sheet-header"
          >
            <AccordionSummary
              sx={{ flex: 1, padding: 0, margin: 0 }}
              slotProps={{
                button: {
                  sx: {
                    padding: 0,
                    margin: 0,
                    borderRadius: 0,
                    gap: 3,
                    "--variant-plainHoverBg": "transparent",
                    "--variant-plainActiveBg": "transparent",
                    "--Icon-color": (theme) => theme.palette.primary[500],
                  },
                },
              }}
            >
              {props.summary}
            </AccordionSummary>
            {props.controls}
          </Stack>
          <AccordionDetails
            sx={{ padding: 0, margin: 0 }}
            slotProps={{
              content: {
                sx: { paddingInline: 0, paddingTop: 3, paddingBottom: 1 },
              },
            }}
          >
            {props.details}
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Sheet>
  );
}
