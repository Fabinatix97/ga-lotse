/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DownloadOutlined } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Box, Button, IconButton, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";

import { DetailsSection, InformationSheet } from "@eshg/lib-employee-portal";
import { formatDate, useResetAlertContext } from "@eshg/lib-portal";
import {
  ApiMedicalHistory,
  ApiProcedureStatus,
} from "@eshg/travel-medicine-api";

import { useDownloadMedicalHistoryPdf } from "@/lib/businessModules/travelMedicine/api/download/files";
import {
  useGetAllMedicalHistoriesQuery,
  useGetStatusQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { MedicalHistory } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistory";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelNav } from "@/lib/shared/components/sidePanel/SidePanelNav";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";

export function MedicalHistoriesContent({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const [editMode, setEditMode] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<ApiMedicalHistory>();

  const resetAlertContext = useResetAlertContext();
  const medicalHistoryPdf = useDownloadMedicalHistoryPdf();

  const [{ data: allMedicalHistories }, { data: status }] = useSuspenseQueries({
    queries: [
      useGetAllMedicalHistoriesQuery(procedureId),
      useGetStatusQuery(procedureId),
    ],
  });

  function isProcedureClosed() {
    return status === ApiProcedureStatus.Closed;
  }

  function downloadAction(medicalHistoryId: string): ReactNode {
    return (
      !editMode && (
        <IconButton
          color="primary"
          variant="outlined"
          aria-label="Anamnese herunterladen"
          onClick={() => getMedicalHistoryPdf(medicalHistoryId)}
        >
          <DownloadOutlined />
        </IconButton>
      )
    );
  }

  async function getMedicalHistoryPdf(medicalHistoryId: string) {
    await medicalHistoryPdf.download({ procedureId, medicalHistoryId });
  }

  useEffect(() => {
    const procedureStepId = new URLSearchParams(window.location.search).get(
      "medical-history",
    );

    if (procedureStepId) {
      setMedicalHistory(
        allMedicalHistories.medicalHistories.find(
          (mH) => mH.procedureStepId === procedureStepId,
        ),
      );
    } else {
      setMedicalHistory(
        allMedicalHistories.medicalHistories.find((mH) => !mH.followUp),
      );
    }
  }, [allMedicalHistories.medicalHistories]);

  return (
    <Stack
      direction={{ md: "row" }}
      sx={{ flex: "1 1 auto" }}
      gap={2}
      display="flex"
    >
      <Stack data-testid="content" display="flex" sx={{ flex: "1 1 auto" }}>
        <InformationSheet sx={{ flex: "1 1 auto" }}>
          {medicalHistory && (
            <DetailsSection
              data-testid="medical-history-card-tile"
              title={
                medicalHistory.followUp
                  ? `${formatDate(medicalHistory.appointment)} Folgeanamnese`
                  : `${formatDate(medicalHistory.appointment)} Hauptanamnese`
              }
              canEdit={!editMode && !isProcedureClosed()}
              buttons={downloadAction(medicalHistory.id)}
              onEdit={() => {
                setEditMode(!editMode);
              }}
            >
              <MedicalHistory
                medicalHistory={medicalHistory}
                procedureId={procedureId}
                readOnly={!editMode}
                onCancel={() => {
                  setEditMode(false);
                }}
              />
            </DetailsSection>
          )}
        </InformationSheet>
      </Stack>
      <Stack>
        <SidePanel role="region" ariaLablledby="anmenesen-title">
          <SidePanelTitle component="h2" id="anamnesen-title">
            Anamnesen
          </SidePanelTitle>
          <SidePanelNav>
            <Box display="contents" role="list">
              {allMedicalHistories.medicalHistories.map((value, index) => {
                return (
                  <Box key={index} display="contents" role="listitem">
                    <Button
                      color="neutral"
                      startDecorator={
                        value.isCompletelyAnswered ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <EditNoteIcon />
                        )
                      }
                      variant="outlined"
                      aria-pressed={
                        medicalHistory?.id === value.id ? "true" : undefined
                      }
                      sx={
                        medicalHistory?.id === value.id
                          ? {
                              backgroundColor: "#E3EFFB",
                            }
                          : undefined
                      }
                      onClick={() => {
                        setMedicalHistory(value);
                        resetAlertContext();
                      }}
                    >
                      {value.followUp
                        ? `${formatDate(value.appointment)} Folgeanamnese`
                        : `${formatDate(value.appointment)} Hauptanamnese`}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </SidePanelNav>
        </SidePanel>
      </Stack>
    </Stack>
  );
}
