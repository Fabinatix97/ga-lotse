/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { PropsWithChildren, useCallback } from "react";

import {
  DateField,
  FormPlus,
  Alert as SharedAlert,
  SubmitButton,
} from "@eshg/lib-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";

import { VaccinationStatusSection } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/VaccinationStatusSection";
import { WrappedSelectField } from "@/lib/businessModules/measlesProtection/shared/WrappedSelectField";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

import {
  OtherComment,
  reasons,
  roleStatuses,
} from "./MeaslesProtectionProcedureData";
import {
  ErrorMessage,
  FormValidator,
  SubmitProcedure,
  UpdateProcedureForm,
  mapProcedureToAdditionalInfoForm,
  transformToValid,
  validateProcedure,
} from "./helpers";

type ProcedureFormProps = PropsWithChildren<{
  initialValues: UpdateProcedureForm;
  submitProcedure: SubmitProcedure;
  validate?: FormValidator;
}>;
export function ProcedureForm({
  submitProcedure,
  children,
  initialValues,
  validate,
}: ProcedureFormProps) {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={validate}
      onSubmit={(form) => submitProcedure(transformToValid(form))}
    >
      <FormPlus sx={{ display: "contents" }}>{children}</FormPlus>
    </Formik>
  );
}

function InvalidFormWarning({
  errorMessages,
}: {
  errorMessages: ErrorMessage[] | undefined;
}) {
  if (!errorMessages) {
    return null;
  }

  return errorMessages.map((t) => (
    <SharedAlert key={t.title} color="danger" {...t} />
  ));
}

export function UpdateProcedureSection({
  openProcedure,
  procedure,
}: Readonly<{
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
  openProcedure: SubmitProcedure;
}>) {
  const title = "Zusatzinfos";
  const initialValues: UpdateProcedureForm =
    mapProcedureToAdditionalInfoForm(procedure);
  const isDraft = procedure.type === "DraftMeaslesProcedure";
  const procedureClosed = !procedure.isOpen;

  const validate: FormValidator = useCallback(
    (_: UpdateProcedureForm) => {
      const additionalErrors = validateProcedure(procedure);
      if (!additionalErrors) {
        return {};
      }
      return { additionalErrors };
    },
    [procedure],
  );
  const errorMessages = validateProcedure(procedure);

  return (
    <ProcedureForm
      submitProcedure={openProcedure}
      validate={validate}
      initialValues={initialValues}
    >
      <Stack rowGap={3}>
        <InfoTile title={title} name="additionalInfo">
          <Stack gap={2} width="100%">
            <UpdateProcedureSectionFields errorMessages={errorMessages} />
          </Stack>
        </InfoTile>
        <VaccinationStatusSection
          procedureId={procedure.id}
          measlesVaccinationStatus={
            procedure.measlesVaccinationStatusFromSchoolEntry
          }
        />
        <EditActions isDraft={isDraft} isOpen={!procedureClosed} />
      </Stack>
    </ProcedureForm>
  );
}

export type UpdateProcedureSectionFieldsProps = Readonly<{
  errorMessages?: ErrorMessage[] | undefined;
}>;
export function UpdateProcedureSectionFields({
  errorMessages,
}: UpdateProcedureSectionFieldsProps) {
  return (
    <>
      <InvalidFormWarning errorMessages={errorMessages} />

      <WrappedSelectField
        name="roleStatus"
        label="Personenstatus"
        options={roleStatuses}
        required="Bitte einen Personenstatus auswählen."
      />
      <DateField
        name="reportData.reportingDate"
        label="Meldedatum"
        required="Bitte Meldedatum ausfüllen"
      />
      <WrappedSelectField
        name="reportData.reportingReason"
        options={reasons}
        label="Meldegrund"
        required="Bitte Meldegrund ausfüllen"
      />
      <OtherComment />
    </>
  );
}

function EditActions({
  isDraft,
  isOpen,
}: Readonly<{
  isOpen: boolean;
  isDraft?: boolean;
}>) {
  const { isSubmitting } = useFormikContext<UpdateProcedureForm>();

  if (!isDraft && !isOpen) {
    return null;
  }

  return (
    <Sheet component="section">
      <SubmitButton submitting={isSubmitting} fullWidth>
        Vorgang anlegen
      </SubmitButton>
    </Sheet>
  );
}
