/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { IconButton } from "@eshg/lib-employee-portal";
import { AlertProps } from "@eshg/lib-portal/components/Alert";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";
import TabOutlined from "@mui/icons-material/TabOutlined";
import { Stack, Typography } from "@mui/joy";
import { addWeeks } from "date-fns";
import { Formik } from "formik";
import { useCallback, useEffect, useState } from "react";

import {
  useCreateProofRequestLetterMutation,
  useSaveProofRequestLetterMutation,
} from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { DateAndButtonRow } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DateAndButtonRow";
import { LetterRecipientField } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/LetterRecipientField";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface ProofRequestLetterValues {
  recipientId: string;
  deadline: string;
  deliveryCertificate: boolean;
  fileURL?: string;
}

const initialLetterValues: ProofRequestLetterValues = {
  recipientId: "",
  deadline: "",
  deliveryCertificate: false,
  fileURL: "",
};

type LetterCreationStage = "create" | "preview";

export function ProofRequestLetterSidebar({ id }: Readonly<{ id: string }>) {
  const procedure = useProcedureQuery(id).data;
  const snackbar = useSnackbar();
  const [openProofRequestLetter, setOpenProofRequestLetter] = useSearchParam(
    "add-proof-request-letter",
    "boolean",
  );

  const [letterValues, setLetterValues] =
    useState<Readonly<ProofRequestLetterValues>>(initialLetterValues);
  const [stage, setStage] = useState<LetterCreationStage>("create");

  useEffect(() => {
    return () => {
      if (openProofRequestLetter && letterValues.fileURL) {
        URL.revokeObjectURL(letterValues.fileURL);
      }
    };
  }, [openProofRequestLetter, letterValues.fileURL]);

  const handleBackToCreatePreview = useCallback(() => {
    setStage("create");
  }, [setStage]);

  const handleClose = useCallback(() => {
    setOpenProofRequestLetter(false);
    setStage("create");
  }, [setOpenProofRequestLetter, setStage]);

  const createProofRequestLetter = useCreateProofRequestLetterMutation({
    onSuccess: (file: File) => {
      setLetterValues({ ...letterValues, fileURL: URL.createObjectURL(file) });
      setStage("preview");
    },
    onError: () => {
      snackbar.error(
        "Die Vorschau des Anschreibens zur Nachweisvorlage konnte nicht erstellt werden.",
      );
    },
  });

  const createPreview = useCallback(
    (data: typeof initialLetterValues) => {
      if (!openProofRequestLetter) {
        return;
      }
      setLetterValues(data);
      return createProofRequestLetter.mutate({
        id,
        data: {
          recipientId: data.recipientId,
          deadline: new Date(data.deadline),
          withDeliveryCertificate: data.deliveryCertificate,
        },
      });
    },
    [openProofRequestLetter, createProofRequestLetter, setLetterValues, id],
  );

  const saveProofRequestLetter = useSaveProofRequestLetterMutation({
    onSuccess: () => {
      snackbar.confirmation(
        "Anschreiben zur Nachweisvorlage wurde erfolgreich gespeichert.",
      );
      handleClose();
    },
    onError: () => {
      snackbar.error(
        "Anschreiben zur Nachweisvorlage konnte nicht gespeichert werden.",
      );
    },
  });

  const savePreview = useCallback(
    (data: typeof initialLetterValues) => {
      if (!openProofRequestLetter || stage !== "preview") {
        return;
      }
      return saveProofRequestLetter.mutate({
        id,
        data: {
          recipientId: data.recipientId,
          deadline: new Date(data.deadline),
          withDeliveryCertificate: data.deliveryCertificate,
        },
      });
    },
    [openProofRequestLetter, stage, id, saveProofRequestLetter],
  );

  return (
    <Sidebar open={openProofRequestLetter} onClose={handleClose}>
      {stage === "create" && (
        <CreateProofRequestLetterSidebarForm
          procedure={procedure}
          letterValues={letterValues}
          onCancel={handleClose}
          onSubmit={createPreview}
        />
      )}
      {stage === "preview" && (
        <PreviewProofRequestLetterSidebarForm
          letterValues={letterValues}
          onBack={handleBackToCreatePreview}
          onCancel={handleClose}
          onSubmit={savePreview}
        />
      )}
    </Sidebar>
  );
}

interface CreateProofRequestLetterSidebarProps {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
  letterValues: ProofRequestLetterValues;
  onSubmit: (letterValues: ProofRequestLetterValues) => void;
  onCancel: () => void;
}

function CreateProofRequestLetterSidebarForm({
  procedure,
  onSubmit,
  letterValues,
  onCancel,
}: Readonly<CreateProofRequestLetterSidebarProps>) {
  const todayInSixWeeks = addWeeks(new Date(), 6).toISOString().slice(0, 10);

  const alertProps: AlertProps = {
    title: "Info",
    message:
      "Bitte Daten vervollständigen. Im nächsten Schritt wird ein Anschreiben erstellt.",
    color: "primary",
  };

  return (
    <Formik initialValues={letterValues} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm>
          <SidebarContent
            title={"Anschreiben zur Nachweisvorlage erstellen"}
            header={
              <Typography
                textColor={"text.secondary"}
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Schritt 1 von 2
              </Typography>
            }
            alert={alertProps}
          >
            <Stack gap={3}>
              <LetterRecipientField procedure={procedure} />
              <DateAndButtonRow
                onButtonClick={() => setFieldValue("deadline", todayInSixWeeks)}
                buttonLabel="Heute in 6 Wochen"
                name="deadline"
                label="Frist"
                required="Bitte ein Fristdatum angeben."
              ></DateAndButtonRow>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Weiter"
              submitting={isSubmitting}
              onCancel={() => {
                void setFieldValue("deadline", initialLetterValues.deadline);
                onCancel();
              }}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

interface PreviewProofRequestLetterSidebarProps {
  letterValues: ProofRequestLetterValues;
  onSubmit: (letterValues: ProofRequestLetterValues) => void;
  onBack: () => void;
  onCancel: () => void;
}

function PreviewProofRequestLetterSidebarForm({
  letterValues,
  onSubmit,
  onBack,
  onCancel,
}: Readonly<PreviewProofRequestLetterSidebarProps>) {
  const alertProps: AlertProps = {
    title: "Info",
    message:
      "Bitte überprüfen Sie das erstellte Dokument. Wenn es fehlerfrei ist, speichern Sie es ab und laden es anschließend für den manuellen Versand herunter.",
    color: "primary",
  };

  function openFile() {
    if (!letterValues.fileURL) {
      return;
    }
    window.open(letterValues.fileURL);
  }

  return (
    <Formik initialValues={letterValues} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent
            title={"Anschreiben zur Nachweisvorlage erstellen"}
            header={
              <Typography
                textColor={"text.secondary"}
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Schritt 2 von 2
              </Typography>
            }
            alert={alertProps}
          >
            <Stack
              direction="row"
              gap={3}
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                disabled={false}
                label={"In neuem Tab öffnen"}
                onClick={openFile}
                sx={{
                  backgroundColor: "transparent",
                  padding: "4px 16px",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Typography
                    textColor={"text.primary"}
                    sx={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    In neuem Tab öffnen
                  </Typography>
                  <TabOutlined
                    sx={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                </Stack>
              </IconButton>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onBack={onBack}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
