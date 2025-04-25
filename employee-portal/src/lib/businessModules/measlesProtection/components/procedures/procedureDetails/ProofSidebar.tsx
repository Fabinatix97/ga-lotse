/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useCallback } from "react";
import { isNullish } from "remeda";

import {
  FileField,
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiSubmissionResult,
  CreateProofSubmissionRequest,
} from "@eshg/measles-protection-api";

import { useAddProofMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { submissionResultOptions } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { DateAndButtonRow } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DateAndButtonRow";
import { WrappedSelectField } from "@/lib/businessModules/measlesProtection/shared/WrappedSelectField";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface InitialProofSubmissionValues {
  submissionResult: string;
  submissionDate: string;
  medicalAttestDeadline: string;
  document: File | null;
}

const initialValues: InitialProofSubmissionValues = {
  submissionResult: "",
  submissionDate: "",
  medicalAttestDeadline: "",
  document: null,
};

export function ProofSidebar({ id }: { id: string }) {
  const [_open, setOpen] = useSearchParam("add-proof", "boolean");
  const snackbar = useSnackbar();

  const addProof = useAddProofMutation({
    onSuccess: () => {
      snackbar.confirmation("Nachweisvorlage wurde erfolgreich angelegt.");
      setOpen(false);
    },
  });

  const handleSubmit = useCallback(
    (data: typeof initialValues) => {
      const formData = new FormData();
      if (!isNullish(data.document)) {
        formData.append("file", data.document);
      }
      return addProof.mutateAsync({
        id,
        formData,
        data: {
          request: {
            submissionResult: data.submissionResult,
            submissionDate: new Date(data.submissionDate),
            medicalAttestDeadline:
              data.submissionResult === ApiSubmissionResult.TempMedicalAttest
                ? new Date(data.medicalAttestDeadline)
                : undefined,
          },
        } as CreateProofSubmissionRequest,
      });
    },
    [addProof, id],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <ProofSidebarForm />
    </Formik>
  );
}

function ProofSidebarForm() {
  const {
    isSubmitting,
    handleSubmit: handleRawSubmit,
    setFieldValue,
    values,
    resetForm,
  } = useFormikContext<typeof initialValues>();
  const [open, setOpen] = useSearchParam("add-proof", "boolean");
  const today = new Date().toISOString().slice(0, 10);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm, setOpen]);

  return (
    <Sidebar open={open} onClose={() => setOpen(false)}>
      <SidebarForm onSubmit={handleRawSubmit}>
        <SidebarContent title={"Nachweisvorlage hinzufügen"}>
          <Stack gap={3}>
            <WrappedSelectField
              name="submissionResult"
              label="Resultat"
              options={submissionResultOptions}
              required="Bitte ein Resultat auswählen."
            />
            {values.submissionResult ===
            ApiSubmissionResult.TempMedicalAttest ? (
              <DateField
                name="medicalAttestDeadline"
                label="Frist zum medizinischen Attest"
                required="Bitte ein Fristdatum angeben."
              />
            ) : null}
            <DateAndButtonRow
              buttonLabel="Heute"
              onButtonClick={() => setFieldValue("submissionDate", today)}
              name="submissionDate"
              label="Vorlagedatum"
              required="Bitte ein Vorlagedatum angeben."
            ></DateAndButtonRow>
            <FileField
              name="document"
              label="Dokument zur Nachweisvorlage"
              accept={[FileType.Pdf]}
            />
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Hinzufügen"
            submitting={isSubmitting}
            onCancel={handleCancel}
          />
        </SidebarActions>
      </SidebarForm>
    </Sidebar>
  );
}
