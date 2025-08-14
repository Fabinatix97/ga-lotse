/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Stack, Typography } from "@mui/joy";
import { Fragment } from "react";

import { ApiChecklist } from "@eshg/inspection-api";

import { ChecklistSection } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/ChecklistSection";

interface ChecklistProps {
  checklist?: ApiChecklist;
  inspectionExternalId: string;
  readOnly?: boolean;
}

export function Checklist({
  checklist,
  inspectionExternalId,
  readOnly,
}: Readonly<ChecklistProps>) {
  if (!checklist) return false;

  return (
    <Stack spacing={2} sx={{ overflow: "hidden", display: "flex", flex: 1 }}>
      <Box
        data-testid="infoPanel"
        boxShadow="sm"
        border="1px solid var(--neutral-outlined-border, #CDD7E1);"
        borderRadius={12}
        sx={{
          overflow: "auto",
          padding: 3,
          backgroundColor: "white",
        }}
      >
        <Stack
          sx={{
            padding: 3,
            backgroundColor: "#F0F4F8",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography level="h3" component="h2">
            Checkliste: {checklist.context.name} (Version{" "}
            {checklist.context.version})
          </Typography>
        </Stack>
        {checklist.sections.map((section, sectionIndex) => (
          <Fragment key={section.context.id}>
            <ChecklistSection
              inspectionExternalId={inspectionExternalId}
              checklistId={checklist.id}
              section={section}
              sectionIndex={sectionIndex}
              readOnly={readOnly}
            />
          </Fragment>
        ))}
      </Box>
    </Stack>
  );
}
