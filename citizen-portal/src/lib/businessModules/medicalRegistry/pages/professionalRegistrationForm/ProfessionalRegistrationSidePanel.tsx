/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import {
  DataPrivacyFormValues,
  WrittenConfirmationFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { BooleanRadioField } from "@eshg/lib-portal/components/formFields/BooleanRadioField";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, Typography } from "@mui/joy";
import { useField, useFormikContext } from "formik";
import { isEmpty } from "remeda";

import { useMedicalRegistryPublicCitizenApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { useCitizenRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { CheckboxField } from "@/lib/businessModules/travelMedicine/components/shared/components/formField/CheckboxField";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

export function ProfessionalRegistrationSidePanel() {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);
  const { handleSubmit, validateForm, setTouched, touched } =
    useFormikContext();
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();
  const citizenRoutes = useCitizenRoutes();

  const writtenConfirmationForm =
    createFieldNameMapper<WrittenConfirmationFormValues>(
      "writtenConfirmationForm",
    );

  const [requestForWrittenConfirmation] = useField<boolean>(
    writtenConfirmationForm("requestForWrittenConfirmation"),
  );

  const snackbar = useSnackbar();

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
          {requestForWrittenConfirmation.value && (
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
        {currentStep < totalSteps && (
          <Button
            onClick={async () => {
              const errors = await validateForm();
              await setTouched({ ...touched, ...errors });

              if (isEmpty(errors)) {
                goForward();
              } else {
                snackbar.error(t("snackbar.errors"));
              }
            }}
          >
            {t("navigation.continue")}
          </Button>
        )}
        {currentStep === totalSteps && (
          <>
            <Typography level="h2">
              {t("stepFour.sidePanel.completion")}
            </Typography>
            <PrivacyPolicyConfirmationForm />
            <Button onClick={() => handleSubmit()}>
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
          <DownloadLink
            downloadContainerRef={privacyNoticeFile.downloadContainerRef}
            fontSize="sm"
            onDownload={() => privacyNoticeFile.download()}
          >
            {t("stepFour.sidePanel.links.dataPrivacyNotice")}
          </DownloadLink>
        }
        required={t("validations.confirmation")}
      />

      <ConfirmationCheckboxField
        name={dataPrivacyForm("agreedDataPrivacyPolicy")}
        label={t("stepFour.sidePanel.label.agreedDataPrivacyPolicy")}
        descriptionText={
          <DownloadLink
            downloadContainerRef={privacyPolicyFile.downloadContainerRef}
            fontSize="sm"
            onDownload={() => privacyPolicyFile.download()}
          >
            {t("stepFour.sidePanel.links.dataPrivacyPolicy")}
          </DownloadLink>
        }
        required={t("validations.confirmation")}
      />
    </>
  );
}
