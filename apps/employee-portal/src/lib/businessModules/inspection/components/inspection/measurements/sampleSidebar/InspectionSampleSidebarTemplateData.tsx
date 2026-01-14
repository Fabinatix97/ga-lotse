/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";

import { ApiInspectionSampleTemplate } from "@eshg/inspection-api";

import { SampleTemplate } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/SampleTemplate";

interface InspectionSampleSidebarTemplateDataProps {
  templates: ApiInspectionSampleTemplate[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
}

export function InspectionSampleSidebarTemplateData({
  templates,
  onSelect,
  selectedIndex,
}: InspectionSampleSidebarTemplateDataProps) {
  return (
    <Grid container gap={2} sx={{ display: "grid" }}>
      {templates.map((template, index) => (
        <SampleTemplate
          key={index}
          index={index}
          selectedIndex={selectedIndex}
          title={template.name}
          parameters={template.measurementParameters}
          onSelect={onSelect}
        />
      ))}
    </Grid>
  );
}
