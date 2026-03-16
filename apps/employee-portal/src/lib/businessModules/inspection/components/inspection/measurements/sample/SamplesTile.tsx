/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Add,
  AssignmentOutlined,
  FileUploadOutlined,
} from "@mui/icons-material";
import { Button, Checkbox, Divider, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  ApiInspFacility,
  ApiInspectionPhase,
  ApiInspectionSample,
  ApiInspectionSampleEvaluationType,
} from "@eshg/inspection-api";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { useGetSamples } from "@/lib/businessModules/inspection/api/queries/sample";
import { useInspectionAddSampleSidebar } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionAddSampleSidebar";
import { useInspectionTemplateSampleSidebar } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionTemplateSampleSidebar";
import { Sample } from "@/lib/businessModules/inspection/components/inspection/measurements/sample/Sample";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
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
  const inspectionTemplateSampleSidebar = useInspectionTemplateSampleSidebar();

  const [showOnlySuspiciousParameters, setShowOnlySuspiciousParameters] =
    useState(false);
  const [showOnlyLaboratoryParameters, setShowOnlyLaboratoryParameters] =
    useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const inspectionApi = useInspectionApi();
  const { data: samples } = useGetSamples(procedureId);
  const [{ data: inspection }] = useSuspenseQueries({
    queries: [getInspectionQuery(inspectionApi, procedureId)],
  });

  const hasReachedClosed = !inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.Closed,
  );

  const visibleSamples = samples.filter((sample) => {
    const suspicious = sample.measurementParameters.some(
      (p) =>
        p.preclassification === "TOO_HIGH" || p.preclassification === "TOO_LOW",
    );

    if (showOnlySuspiciousParameters && !suspicious) return false;

    return !(
      showOnlyLaboratoryParameters &&
      sample.evaluationType !== ApiInspectionSampleEvaluationType.Laboratory
    );
  });

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    inspectionAddMeasurementSidebar.open({
      procedureId: procedureId,
      facility: facility,
    });
  }

  function handleAddViaTemplate(e: React.MouseEvent) {
    e.stopPropagation();
    inspectionTemplateSampleSidebar.open({
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

    const allNoNormSpecified = params.every(
      (p) =>
        p.preclassification === undefined ||
        p.preclassification === "NO_NORM_SPECIFIED",
    );

    if (allNoNormSpecified) {
      return "NO_NORM";
    }

    return "OK";
  }

  function toggleExpandAll() {
    const expand = !visibleSamples.every((s) => expandedItems[s.sampleId]);

    const newState: Record<string, boolean> = {};
    for (const s of visibleSamples) {
      newState[s.sampleId] = expand;
    }

    setExpandedItems((prev) => ({ ...prev, ...newState }));
  }

  function setupItems() {
    return visibleSamples.map((sample, index) => {
      const expanded = expandedItems[sample.sampleId] ?? false;

      return (
        <Sample
          key={sample.sampleId}
          sample={sample}
          procedureId={procedureId}
          sampleIndex={index}
          facility={facility}
          classification={getSampleClassification(sample)}
          showOnlySuspiciousParameters={showOnlySuspiciousParameters}
          expand={expanded}
          hasReachedClosed={hasReachedClosed}
          onSetExpand={(open) =>
            setExpandedItems((prev) => ({
              ...prev,
              [sample.sampleId]: open,
            }))
          }
        />
      );
    });
  }

  const addAction = (
    <>
      <Button
        color="primary"
        variant="plain"
        aria-label="Vorlage verwenden"
        startDecorator={<AssignmentOutlined />}
        onClick={(e) => {
          handleAddViaTemplate(e);
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
      controls={!hasReachedClosed && addAction}
    >
      <Divider />
      <Stack
        sx={{ alignItems: "center", justifyContent: "space-between" }}
        direction="row"
      >
        <Button
          name="expandAllSamples"
          variant="plain"
          onClick={toggleExpandAll}
        >
          {visibleSamples.length > 0 &&
          visibleSamples.every((s) => expandedItems[s.sampleId])
            ? "Alle Proben zuklappen"
            : "Alle Proben aufklappen"}
        </Button>
        <Stack
          direction="row"
          gap={2}
          sx={{
            paddingX: 2,
          }}
        >
          <Checkbox
            name="showOnlyLaboratoryParameters"
            label="Externe Laborauswertungen"
            onChange={(event) => {
              setShowOnlyLaboratoryParameters(event.target.checked);
            }}
          />
          <Checkbox
            name="showOnlySuspiciousParameters"
            label="Nur auffällige Parameter anzeigen"
            onChange={(event) => {
              setShowOnlySuspiciousParameters(event.target.checked);
            }}
          />
        </Stack>
      </Stack>

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
