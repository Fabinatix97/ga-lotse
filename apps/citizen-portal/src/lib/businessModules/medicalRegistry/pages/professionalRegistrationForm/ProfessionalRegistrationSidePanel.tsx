/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { isEmpty } from "remeda";

import {
  BooleanRadioField,
  ButtonLink,
  CheckboxField,
  InternalLinkButton,
  useFileDownload,
  useMultiStepForm,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  DataPrivacyFormValues,
  MedicalRegistryCreateProcedureFormValues,
  WrittenConfirmationFormValues,
} from "@eshg/medical-registry";

import { useMedicalRegistryPublicCitizenApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { useCitizenRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

export function ProfessionalRegistrationSidePanel() {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);
  const { values, handleSubmit, validateForm, setTouched, touched } =
    useFormikContext();
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();
  const citizenRoutes = useCitizenRoutes();

  const writtenConfirmationForm =
    createFieldNameMapper<WrittenConfirmationFormValues>(
      "writtenConfirmationForm",
    );

  const requestForWrittenConfirmation = (
    values as MedicalRegistryCreateProcedureFormValues
  ).writtenConfirmationForm.requestForWrittenConfirmation;

  const snackbar = useSnackbar();

  async function handleFormWithSnackbar(handleFunction: () => void) {
    const errors = await validateForm();
    await setTouched({ ...touched, ...errors });

    if (isEmpty(errors)) {
      handleFunction();
    } else {
      snackbar.error(t("snackbar.errors"), { manualClose: false });
    }
  }

  return (
    <>
      {currentStep === totalSteps && (
        <ContentSheet sx={{ marginBottom: 2 }}>
          <Typography level="h2">
            {t("stepFour.sidePanel.confirmation")}
          </Typography>
          <BooleanRadioField
            name={writtenConfirmationForm("requestForWrittenConfirmation")}
            label={t("stepFour.sidePanel.label.writtenConfirmation")}
          />
          {requestForWrittenConfirmation && (
            <>
              <CheckboxField
                name={writtenConfirmationForm("confirmationFee")}
                label={t("stepFour.sidePanel.label.confirmationFee")}
                required={t("validations.confirmation")}
              />
              <CheckboxField
                name={writtenConfirmationForm("confirmationByPost")}
                label={t("stepFour.sidePanel.label.confirmationByPost")}
                required={t("validations.confirmation")}
              />
            </>
          )}
        </ContentSheet>
      )}

      <ContentSheet>
        <Stack gap={2}>
          {currentStep < totalSteps && (
            <Button onClick={() => handleFormWithSnackbar(goForward)}>
              {t("navigation.continue")}
            </Button>
          )}
          {currentStep === totalSteps && (
            <>
              <Typography level="h2">
                {t("stepFour.sidePanel.completion")}
              </Typography>
              <PrivacyPolicyConfirmationForm />
              <Button onClick={() => handleFormWithSnackbar(handleSubmit)}>
                {t("navigation.submit")}
              </Button>
            </>
          )}
          {currentStep > 1 && (
            <Button variant="outlined" onClick={goBack}>
              {t("navigation.back")}
            </Button>
          )}
          <InternalLinkButton
            variant="soft"
            color="neutral"
            href={citizenRoutes.home}
          >
            {t("navigation.abort")}
          </InternalLinkButton>
        </Stack>
      </ContentSheet>
    </>
  );
}

function PrivacyPolicyConfirmationForm() {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  const dataPrivacyForm =
    createFieldNameMapper<DataPrivacyFormValues>("dataPrivacyForm");

  const publicCitizenApi = useMedicalRegistryPublicCitizenApi();
  const privacyNoticeFile = useFileDownload(() =>
    publicCitizenApi.getPrivacyNoticeRaw(),
  );
  const privacyPolicyFile = useFileDownload(() =>
    publicCitizenApi.getPrivacyPolicyRaw(),
  );

  return (
    <>
      <ConfirmationCheckboxField
        name={dataPrivacyForm("agreedDataPrivacyNotice")}
        label={t("stepFour.sidePanel.label.agreedDataPrivacyNotice")}
        descriptionText={
          <ButtonLink
            fontSize="sm"
            onClick={() => privacyNoticeFile.download()}
          >
            {t("stepFour.sidePanel.links.dataPrivacyNotice")}
          </ButtonLink>
        }
        required={t("validations.confirmation")}
      />

      <ConfirmationCheckboxField
        name={dataPrivacyForm("agreedDataPrivacyPolicy")}
        label={t("stepFour.sidePanel.label.agreedDataPrivacyPolicy")}
        descriptionText={
          <ButtonLink
            fontSize="sm"
            onClick={() => privacyPolicyFile.download()}
          >
            {t("stepFour.sidePanel.links.dataPrivacyPolicy")}
          </ButtonLink>
        }
        required={t("validations.confirmation")}
      />
    </>
  );
}
