/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Add,
  AssignmentOutlined,
  FileUploadOutlined,
} from "@mui/icons-material";
import { Button, Checkbox, Divider, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { ApiInspFacility, ApiInspectionSample } from "@eshg/inspection-api";

import { useGetSamples } from "@/lib/businessModules/inspection/api/queries/sample";
import { useInspectionAddSampleSidebar } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionAddSampleSidebar";
import { Sample } from "@/lib/businessModules/inspection/components/inspection/measurements/sample/Sample";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface SamplesTileProps {
  readonly?: boolean;
  procedureId: string;
  facility: ApiInspFacility;
}

export function SamplesTile({
  procedureId,
  facility,
}: Readonly<SamplesTileProps>) {
  const inspectionAddMeasurementSidebar = useInspectionAddSampleSidebar();
  const [showOnlyConspicuousParameters, setShowOnlyConspicuousParameters] =
    useState(false);
  const { data: samples } = useGetSamples(procedureId);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    inspectionAddMeasurementSidebar.open({
      procedureId: procedureId,
      facility: facility,
    });
  }

  function getSampleClassification(sample: ApiInspectionSample) {
    const params = sample.measurementParameters;

    const hasSuspicious = params.some(
      (p) =>
        p.preclassification === "TOO_HIGH" || p.preclassification === "TOO_LOW",
    );

    if (hasSuspicious) {
      return "SUSPICIOUS";
    }

    const allPending = params.some((p) => p.preclassification === "PENDING");

    if (allPending) {
      return "PENDING";
    }

    return "OK";
  }

  function setupItems(showOnlyConspicuousParameters: boolean) {
    const result = [];
    let index = 0;

    for (const sample of samples) {
      const hasError = sample.measurementParameters.some(
        (p) =>
          p.preclassification === "TOO_HIGH" ||
          p.preclassification === "TOO_LOW",
      );

      if (showOnlyConspicuousParameters && !hasError) {
        continue;
      }

      result.push(
        <Sample
          sample={sample}
          procedureId={procedureId}
          sampleIndex={index++}
          facility={facility}
          classification={getSampleClassification(sample)}
          showOnlyConspicuousParameters={showOnlyConspicuousParameters}
        />,
      );
    }

    return result;
  }

  const addAction = (
    <>
      <Button
        color="primary"
        variant="plain"
        aria-label="Vorlage verwenden"
        startDecorator={<AssignmentOutlined />}
        onClick={(e) => {
          handleAdd(e);
        }}
      >
        <Typography component="span" color="primary" level="title-md">
          Vorlage verwenden
        </Typography>
      </Button>
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
      <Button
        color="primary"
        variant="plain"
        aria-label="Daten importieren"
        startDecorator={<FileUploadOutlined />}
        onClick={(e) => {
          handleAdd(e);
        }}
      >
        <Typography component="span" color="primary" level="title-md">
          Daten importieren
        </Typography>
      </Button>
    </>
  );

  return (
    <InfoTile
      data-testid="samplesTile"
      name={"measurements" + procedureId}
      title="Proben"
      controls={addAction}
    >
      <Divider />
      <Stack sx={{ alignItems: "flex-end" }}>
        <Checkbox
          name="showOnlyConspicuousParameters"
          label="Nur auffällige Parameter anzeigen"
          onChange={(event) => {
            setShowOnlyConspicuousParameters(event.target.checked);
          }}
        />
      </Stack>

      {samples.length > 0 ? (
        setupItems(showOnlyConspicuousParameters)
      ) : (
        <Typography component="span" level="title-md">
          Keine Proben angelegt.
        </Typography>
      )}
    </InfoTile>
  );
}
