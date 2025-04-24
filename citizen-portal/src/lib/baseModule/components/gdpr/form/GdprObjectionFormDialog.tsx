/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureType } from "@eshg/base-api";
import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { useAddGdprProcedure } from "@/lib/baseModule/api/mutations/gdpr";
import { useTranslation } from "@/lib/i18n/client";
import { TextareaField } from "@/lib/shared/components/form/TextareaField";

export function GdprObjectionFormDialog(props: {
  open: boolean;
  onClose: () => void;
}) {
  const addGdprProcedure = useAddGdprProcedure();
  const resetAlertContext = useResetAlertContext();
  const { t } = useTranslation("gdpr");
  const { validateLength } = useValidators();

  function handleClose() {
    resetAlertContext();
    props.onClose();
  }

  async function handleSubmit({
    matterOfConcern,
  }: {
    matterOfConcern: string;
  }) {
    await addGdprProcedure.mutateAsync(
      {
        type: ApiGdprProcedureType.ToObject,
        matterOfConcern,
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  return (
    <BaseModal
      modalTitle={t("start_procedure_dialog.RIGHT_TO_OBJECT.title")}
      onClose={handleClose}
      open={props.open}
    >
      {props.open && (
        <Formik initialValues={{ matterOfConcern: "" }} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <FormPlus>
              <Stack gap={2}>
                <Typography>
                  {t("start_procedure_dialog.RIGHT_TO_OBJECT.description")}
                </Typography>
                <TextareaField
                  name="matterOfConcern"
                  label={t(
                    "start_procedure_dialog.RIGHT_TO_OBJECT.matterOfConcern",
                  )}
                  required={t("validation:required")}
                  validate={validateLength(10, 10000)}
                />

                <Stack alignSelf="end" gap={2} direction="row">
                  <Button variant="outlined" onClick={handleClose}>
                    {t("translation:common.cancel")}
                  </Button>
                  <SubmitButton submitting={isSubmitting}>
                    {t("start_procedure_dialog.RIGHT_TO_OBJECT.submit")}
                  </SubmitButton>
                </Stack>
              </Stack>
            </FormPlus>
          )}
        </Formik>
      )}
    </BaseModal>
  );
}
