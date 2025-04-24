/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureType } from "@eshg/base-api";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { AlertSlot } from "@eshg/lib-portal/errorHandling/AlertContext";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import CheckmarkIcon from "@mui/icons-material/Check";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SendIcon from "@mui/icons-material/Send";
import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";

import { useAddGdprProcedure } from "@/lib/baseModule/api/mutations/gdpr";
import { useTranslation } from "@/lib/i18n/client";
import { TextareaField } from "@/lib/shared/components/form/TextareaField";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

interface ContactFormValues {
  content: string;
}

type ContactFormState = "initial" | "input" | "preview" | "submitted";

export function GdprContactForm() {
  const { t } = useTranslation("gdpr");
  const { validateLength } = useValidators();
  const [formState, setFormState] = useState<ContactFormState>("initial");
  const addGdprProcedure = useAddGdprProcedure();

  async function handleSubmit(values: ContactFormValues) {
    if (formState === "input") {
      setFormState("preview");
      return;
    }

    await addGdprProcedure.mutateAsync(
      {
        type: ApiGdprProcedureType.ToRectification,
        matterOfConcern: values.content,
      },
      { onSuccess: () => setFormState("submitted") },
    );
  }

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("contact_form.title")}</ContentSheetTitle>
      {formState === "initial" && (
        <>
          <Typography
            sx={{
              textWrap: "pretty",
              whiteSpace: "preserve",
              hyphens: "auto",
            }}
          >
            {t("contact_form.description")}
          </Typography>
          <Button onClick={() => setFormState("input")}>
            {t("contact_form.open")}
          </Button>
        </>
      )}
      {formState === "submitted" && (
        <Typography
          sx={{ textWrap: "pretty" }}
          startDecorator={<CheckmarkIcon color="success" />}
        >
          {t("contact_form.success")}
        </Typography>
      )}

      {(formState === "input" || formState === "preview") && (
        <Formik initialValues={{ content: "" }} onSubmit={handleSubmit}>
          {({ isSubmitting, values }) => (
            <FormPlus>
              <Stack gap={2}>
                <AlertSlot />
                {formState === "input" ? (
                  <TextareaField
                    name="content"
                    label={t("contact_form.input_label")}
                    required={t("contact_form.required_input")}
                    validate={validateLength(40, 10000)}
                    sxTextarea={{
                      minHeight: "160px",
                    }}
                  />
                ) : (
                  <>
                    <strong>{t("contact_form.input_label")}:</strong>
                    <Typography
                      sx={{
                        textWrap: "pretty",
                        paddingInline: "0.5rem",
                        whiteSpace: "preserve",
                        hyphens: "auto",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {values.content}
                    </Typography>
                  </>
                )}
                <Stack direction="row" gap={2} justifyContent="space-between">
                  {formState === "input" ? (
                    <>
                      <Button
                        onClick={() => setFormState("initial")}
                        sx={{ minWidth: "fit-content" }}
                        variant="plain"
                      >
                        {t("contact_form.cancel")}
                      </Button>
                      <SubmitButton
                        submitting={isSubmitting}
                        sx={{ minWidth: "fit-content" }}
                        endDecorator={<NavigateNextIcon />}
                      >
                        {t("contact_form.preview")}
                      </SubmitButton>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setFormState("input")}
                        sx={{ minWidth: "fit-content" }}
                        variant="plain"
                      >
                        {t("contact_form.change_input")}
                      </Button>
                      <SubmitButton
                        submitting={isSubmitting}
                        sx={{ minWidth: "fit-content" }}
                        startDecorator={<SendIcon />}
                      >
                        {t("contact_form.submit")}
                      </SubmitButton>
                    </>
                  )}
                </Stack>
              </Stack>
            </FormPlus>
          )}
        </Formik>
      )}
    </ContentSheet>
  );
}
