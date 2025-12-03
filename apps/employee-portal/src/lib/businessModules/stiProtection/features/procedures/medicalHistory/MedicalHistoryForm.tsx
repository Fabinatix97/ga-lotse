/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import Print from "@mui/icons-material/Print";
import { Button, Divider, Sheet, Typography, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Formik } from "formik";
import { useEffect, useState } from "react";

import { ConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import { FormPlus, TextareaField } from "@eshg/lib-portal";
import {
  ApiConcern,
  ApiGetMedicalHistory200Response,
  ApiStiProtectionProcedure,
} from "@eshg/sti-protection-api";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  useUpsertMedicalHistory,
  useUpsertMedicalHistoryOptions,
} from "@/lib/businessModules/stiProtection/api/mutations/medicalHistory";
import {
  MedicalHistoryDocumentLanguage,
  useGetMedicalHistoryDocumentQuery,
} from "@/lib/businessModules/stiProtection/api/queries/medicalHistoryDocument";
import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";
import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";

import {
  MedicalHistoryFormData,
  defaultMedicalHistoryFormValues,
} from "./MedicalHistoryForm.config";
import { mapFormValuesToApi, mapToFormValues } from "./helpers";
import { Examinations } from "./sections/Examinations";
import { General } from "./sections/General";
import { Prevention } from "./sections/Prevention";
import { PreviousIllnesses } from "./sections/PreviousIllnesses";
import { Risks } from "./sections/Risks";
import { SexualOrientationAndContact } from "./sections/SexualOrientationAndContact";

interface MedicalHistoryDocumentInfo {
  concern?: ApiConcern;
  language?: MedicalHistoryDocumentLanguage;
  fileURL?: string;
}

const PaddedDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
}));

export function MedicalHistoryForm({
  procedure: stiProcedure,
  medicalHistory,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
  medicalHistory?: ApiGetMedicalHistory200Response | null;
}>) {
  const formTitle = `Anamnesebogen ${CONCERN_VALUES[stiProcedure.concern]}`;
  const isForSexWork = stiProcedure.concern === "SEX_WORK";

  const [openFile, setOpenFile] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState<MedicalHistoryDocumentInfo>({});
  const { data, isFetched } = useGetMedicalHistoryDocumentQuery(
    fileInfo.concern ?? ApiConcern.HivStiConsultation,
    fileInfo.language ?? "DE",
  );
  const upsertMedicalHistoryOptions = useUpsertMedicalHistoryOptions(
    stiProcedure.id,
  );
  const upsertMedicalHistory = useUpsertMedicalHistory(stiProcedure.id);

  useEffect(() => {
    if (!openFile || !isFetched || !data) {
      return;
    }
    if (fileInfo.fileURL) {
      URL.revokeObjectURL(fileInfo.fileURL);
    }

    fileInfo.fileURL = URL.createObjectURL(data);
    window.open(fileInfo.fileURL);
    setOpenFile(false);
  }, [openFile, isFetched, data, fileInfo, fileInfo.fileURL]);

  function fetchMedicalHistoryDocument(
    concern: ApiConcern,
    language: MedicalHistoryDocumentLanguage,
  ) {
    setFileInfo({ concern, language });
    setOpenFile(true);
  }

  async function onSubmit(values: MedicalHistoryFormData) {
    return upsertMedicalHistory.mutateAsync(
      mapFormValuesToApi(stiProcedure, values),
    );
  }

  return (
    <Formik
      initialValues={
        medicalHistory
          ? mapToFormValues(medicalHistory)
          : defaultMedicalHistoryFormValues()
      }
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <FormPlus aria-labelledby="anamnesis-title">
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertMedicalHistoryOptions,
              variableSupplier: () => mapFormValuesToApi(stiProcedure, values),
            }}
          />
          <Sheet sx={{ overflow: "auto", margin: theme.spacing(3) }}>
            <Typography level="h2" mb={5} id="anamnesis-title">
              {formTitle}
            </Typography>

            <General isForSexWork={isForSexWork} />
            <PaddedDivider />

            <Examinations />
            <PaddedDivider />

            <PreviousIllnesses />
            <PaddedDivider />

            <SexualOrientationAndContact isForSexWork={isForSexWork} />
            <PaddedDivider />

            <Prevention />
            <PaddedDivider />

            <Risks />
            <PaddedDivider />

            <SectionGrid>
              <TextareaField name="remarks" label="Bemerkungen" />
            </SectionGrid>
          </Sheet>
          <TabStickyBottomButtonBar
            left={
              <DownloadButtons
                concern={stiProcedure.concern}
                onClick={fetchMedicalHistoryDocument}
              />
            }
          />
        </FormPlus>
      )}
    </Formik>
  );
}

interface DownloadButtonsProps {
  concern: ApiConcern;
  onClick: (
    concern: ApiConcern,
    language: MedicalHistoryDocumentLanguage,
  ) => void;
}

function DownloadButtons({
  concern,
  onClick: fetchMedicalHistoryDocument,
}: DownloadButtonsProps) {
  return (
    <>
      <PrintButton
        label="Anamnesebogen auf Deutsch herunterladen"
        text="Druckvorlage herunterladen (DE)"
        onClick={() => fetchMedicalHistoryDocument(concern, "DE")}
      />
      <PrintButton
        label="Anamnesebogen auf Englisch herunterladen"
        text="Druckvorlage herunterladen (EN)"
        onClick={() => fetchMedicalHistoryDocument(concern, "EN")}
      />
    </>
  );
}

interface PrintButtonProps {
  text: string;
  label: string;
  onClick: () => void;
  sx?: SxProps;
}

function PrintButton(props: PrintButtonProps) {
  return (
    <Button
      variant="plain"
      aria-label={props.label}
      startDecorator={<Print />}
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}
