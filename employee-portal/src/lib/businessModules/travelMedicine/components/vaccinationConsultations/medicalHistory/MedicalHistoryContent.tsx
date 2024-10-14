/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiMedicalHistory,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/travelMedicine";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  useGetAllMedicalHistoriesQuery,
  useGetStatusQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { MedicalHistory } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistory";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelNav } from "@/lib/shared/components/sidePanel/SidePanelNav";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";

export function MedicalHistoriesContent({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const [editMode, setEditMode] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<ApiMedicalHistory>();

  const alertContext = useAlertContext();

  function resetAlertContext() {
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
  }

  const [{ data: allMedicalHistories }, { data: status }] = useSuspenseQueries({
    queries: [
      useGetAllMedicalHistoriesQuery(procedureId),
      useGetStatusQuery(procedureId),
    ],
  });

  function isProcedureClosed() {
    return status === ApiProcedureStatus.Closed;
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
      display={"flex"}
    >
      <Stack data-testid="content" display={"flex"} sx={{ flex: "1 1 auto" }}>
        <InformationSheet sx={{ flex: "1 1 auto" }}>
          {medicalHistory && (
            <DetailsSection
              name="medical-history-card-tile"
              title={
                medicalHistory.followUp
                  ? `${formatDate(medicalHistory.appointment)} Folgeanamnese`
                  : `${formatDate(medicalHistory.appointment)} Hauptanamnese`
              }
              onEdit={() => {
                setEditMode(!editMode);
              }}
              canEdit={!editMode && !isProcedureClosed()}
            >
              <MedicalHistory
                medicalHistory={medicalHistory}
                readOnly={!editMode}
                onCancel={() => {
                  setEditMode(false);
                }}
              ></MedicalHistory>
            </DetailsSection>
          )}
        </InformationSheet>
      </Stack>
      <Stack>
        <SidePanel>
          <SidePanelTitle component="h3">Anamnesen</SidePanelTitle>
          <SidePanelNav>
            {allMedicalHistories.medicalHistories.map((value, index) => {
              return (
                <Button
                  key={index}
                  color="neutral"
                  startDecorator={
                    value.isCompletelyAnswered ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <EditNoteIcon />
                    )
                  }
                  onClick={() => {
                    setMedicalHistory(value);
                    resetAlertContext();
                  }}
                  variant="outlined"
                  aria-current={
                    medicalHistory?.id === value.id ? "true" : undefined
                  }
                  sx={
                    medicalHistory?.id === value.id
                      ? {
                          backgroundColor: "#E3EFFB",
                        }
                      : undefined
                  }
                >
                  {value.followUp
                    ? `${formatDate(value.appointment)} Folgeanamnese`
                    : `${formatDate(value.appointment)} Hauptanamnese`}
                </Button>
              );
            })}
          </SidePanelNav>
        </SidePanel>
      </Stack>
    </Stack>
  );
}
