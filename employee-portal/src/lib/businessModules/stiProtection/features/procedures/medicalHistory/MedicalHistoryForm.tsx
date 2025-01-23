/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiConcern,
  ApiGetMedicalHistory200Response,
  ApiStiProtectionProcedure,
} from "@eshg/employee-portal-api/stiProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import Print from "@mui/icons-material/Print";
import { Button, Divider, Sheet, Typography, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Formik } from "formik";
import { useEffect, useState } from "react";

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
import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

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

export const AutoWidthHorizontalField = styled(HorizontalField)({
  ".MuiStack-root": {
    justifyContent: "space-between",
  },
});

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

  function onSubmit(values: MedicalHistoryFormData) {
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
      onSubmit={onSubmit}
    >
      {({ isSubmitting, values }) => (
        <FormPlus>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertMedicalHistoryOptions,
              variableSupplier: () => mapFormValuesToApi(stiProcedure, values),
            }}
          />
          <Sheet sx={{ overflow: "auto", margin: theme.spacing(3) }}>
            <Typography level="h2" mb={5}>
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
          <MedicalHistoryStickyBottomButtonBar
            stiProcedure={stiProcedure}
            isSubmitting={isSubmitting}
            onClick={fetchMedicalHistoryDocument}
          />
        </FormPlus>
      )}
    </Formik>
  );
}

interface MedicalHistoryStickyBottomButtonBarProps {
  stiProcedure: ApiStiProtectionProcedure;
  isSubmitting: boolean;
  onClick: (
    concern: ApiConcern,
    language: MedicalHistoryDocumentLanguage,
  ) => void;
}

function MedicalHistoryStickyBottomButtonBar(
  props: MedicalHistoryStickyBottomButtonBarProps,
) {
  const {
    stiProcedure,
    isSubmitting,
    onClick: fetchMedicalHistoryDocument,
  } = props;

  return (
    <StickyBottomButtonBar
      sx={{ padding: "0.75rem 1.5rem" }}
      right={
        <>
          <InternalLinkButton
            href={routes.procedures.byId(stiProcedure.id).details}
            variant="plain"
          >
            Abbrechen
          </InternalLinkButton>
          <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
        </>
      }
      left={
        <>
          <PrintButton
            label={"Anamnesebogen auf Deutsch herunterladen"}
            text={"Druckvorlage herunterladen (DE)"}
            onClick={() =>
              fetchMedicalHistoryDocument(stiProcedure.concern, "DE")
            }
          />
          <PrintButton
            label={"Anamnesebogen auf Englisch herunterladen"}
            text={"Druckvorlage herunterladen (EN)"}
            onClick={() =>
              fetchMedicalHistoryDocument(stiProcedure.concern, "EN")
            }
          />
        </>
      }
    ></StickyBottomButtonBar>
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
      onClick={props.onClick}
      startDecorator={<Print />}
    >
      {props.text}
    </Button>
  );
}
