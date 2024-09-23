/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedure200Response } from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useCallback } from "react";
import { isNullish } from "remeda";

import { useAddAccessRestrictionLetterMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import {
  LetterCreationType,
  letterTypeOptions,
  letterTypeOptionsWithoutCustodian,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { DateAndButtonRow } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DateAndButtonRow";
import { WrappedSelectField } from "@/lib/businessModules/measlesProtection/shared/WrappedSelectField";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { LetterRecipientField } from "./LetterRecipientField";

interface Letter {
  letterCreationType: LetterCreationType;
  recipientId: string;
  sentAt: string;
  document: File | null;
}

export const initialLetterValues: Letter = {
  letterCreationType: LetterCreationType.Manual,
  recipientId: "",
  sentAt: "",
  document: null,
};

export function AccessRestrictionLetterSidebar({ id }: { id: string }) {
  const [_open, setOpen] = useSearchParam(
    "add-access-restriction-letter",
    "boolean",
  );
  const snackbar = useSnackbar();
  const addAccessRestrictionLetter = useAddAccessRestrictionLetterMutation({
    onSuccess: () => {
      snackbar.confirmation("Anschreiben wurde erfolgreich hinzugefügt.");
      setOpen(false);
    },
  });

  const handleSubmit = useCallback(
    (data: Letter) => {
      const formData = new FormData();
      if (!isNullish(data.document)) {
        formData.append("file", data.document);
      }
      return addAccessRestrictionLetter
        .mutateAsync({
          id,
          data: {
            recipientId: data.recipientId,
            sentAt: new Date(data.sentAt),
          },
          formData,
        })
        .catch();
    },
    [addAccessRestrictionLetter, id],
  );

  return (
    <Formik initialValues={initialLetterValues} onSubmit={handleSubmit}>
      <AccessRestrictionLetterSidebarForm id={id} />
    </Formik>
  );
}

export function AccessRestrictionLetterSidebarForm({ id }: { id: string }) {
  const { isSubmitting, handleSubmit, resetForm, values } =
    useFormikContext<Letter>();
  const [open, setOpen] = useSearchParam(
    "add-access-restriction-letter",
    "boolean",
  );
  const procedure = useProcedureQuery(id).data;

  const handleCancel = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm, setOpen]);

  return (
    <Sidebar
      open={open}
      onClose={() => {
        setOpen(false);
        resetForm();
      }}
    >
      <SidebarForm onSubmit={handleSubmit}>
        <SidebarContent title={"Anschreiben hinzufügen"}>
          <Stack gap={3}>
            {values.letterCreationType === LetterCreationType.Manual ? (
              <UploadSentLetterFields procedure={procedure} />
            ) : (
              <GenerateNewLetterFields procedure={procedure} />
            )}
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

interface LetterFieldsProps {
  procedure: ApiGetProcedure200Response;
}

function UploadSentLetterFields(props: Readonly<LetterFieldsProps>) {
  const { setFieldValue } = useFormikContext<Letter>();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <LetterRecipientField procedure={props.procedure} />
      <DateAndButtonRow
        name="sentAt"
        label="Versanddatum"
        required="Bitte ein Versanddatum angeben."
        onButtonClick={() => setFieldValue("sentAt", today)}
        buttonLabel="Heute"
      ></DateAndButtonRow>
      <FileField
        name={"document"}
        label="Dokument"
        required={"Bitte ein Dokument auswählen."}
        accept={[FileType.Pdf]}
      />
    </>
  );
}

function GenerateNewLetterFields(props: Readonly<LetterFieldsProps>) {
  const hasCustodian =
    props.procedure.custodians !== undefined
      ? props.procedure.custodians.length > 0
      : false;

  return (
    <>
      <WrappedSelectField
        name={"letterType"}
        label="Art des Anschreibens"
        options={
          hasCustodian ? letterTypeOptions : letterTypeOptionsWithoutCustodian
        }
        required="Bitte eine Art auswählen."
      />
      <LetterRecipientField procedure={props.procedure} />
    </>
  );
}
