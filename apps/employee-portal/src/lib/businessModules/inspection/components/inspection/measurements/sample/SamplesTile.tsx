/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";

import { useGetSamples } from "@/lib/businessModules/inspection/api/queries/sample";
import { useInspectionAddSampleSidebar } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionAddSampleSidebar";
import { Sample } from "@/lib/businessModules/inspection/components/inspection/measurements/sample/Sample";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface SamplesTileProps {
  readonly?: boolean;
  procedureId: string;
}

export function SamplesTile({ procedureId }: Readonly<SamplesTileProps>) {
  const inspectionAddMeasurementSidebar = useInspectionAddSampleSidebar();

  const { data: samples } = useGetSamples(procedureId);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    inspectionAddMeasurementSidebar.open({ procedureId: procedureId });
  }

  function setupItems() {
    const result = [];
    let index = 0;
    for (const sample of samples) {
      result.push(
        <Sample
          sample={sample}
          procedureId={procedureId}
          sampleIndex={index++}
        />,
      );
    }
    return result;
  }

  const addAction = (
    <Button
      color="primary"
      variant="plain"
      aria-label="Proben hinzufügen"
      startDecorator={<Add />}
      onClick={(e) => {
        handleAdd(e);
      }}
    >
      <Typography component="span" color="primary" level="title-md">
        Probe hinzufügen
      </Typography>
    </Button>
  );

  return (
    <InfoTile
      data-testid="samplesTile"
      name={"measurements" + procedureId}
      title="Proben"
      controls={addAction}
    >
      {samples.length > 0 ? (
        setupItems()
      ) : (
        <Typography component="span" level="title-md">
          Keine Proben angelegt.
        </Typography>
      )}
    </InfoTile>
  );
}
