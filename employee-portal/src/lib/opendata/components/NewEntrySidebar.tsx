/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { Button } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { isEmpty } from "remeda";

import {
  OpenDataForm,
  OpenDataFormValues,
  validateOpenDataForm,
} from "@/lib/opendata/components/OpenDataForm";
import { usePostOpenDocument } from "@/lib/opendata/mutations/opendata";
import { useGetFallbackLicenseUrl } from "@/lib/opendata/queries/opendata";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { SidebarWithFormRefProps } from "@/lib/shared/hooks/useSidebarWithFormRef";

interface NewEntrySidebarProps extends SidebarWithFormRefProps {
  prefilledValues: Pick<OpenDataFormValues, "resourceName">;
}

export function NewEntrySidebar({
  prefilledValues,
  formRef,
  onClose,
}: NewEntrySidebarProps) {
  const postOpenDocument = usePostOpenDocument();

  function handleSubmitNewEntry(
    values: OpenDataFormValues,
    { setSubmitting }: FormikHelpers<OpenDataFormValues>,
  ) {
    postOpenDocument.mutate(
      {
        file: values.file!,
        postOpenDocumentRequest: {
          resourceName: isEmpty(values.resourceName)
            ? undefined
            : values.resourceName,
          versionName: values.versionName,
          description: values.description,
          licence: values.licence,
          statisticStartDate: values.statisticStartDate
            ? new Date(values.statisticStartDate)
            : undefined,
          statisticEndDate: values.statisticEndDate
            ? new Date(values.statisticEndDate)
            : undefined,
          sources: new Set(values.sources),
        },
      },
      { onSuccess: () => onClose(true) },
    );
    setSubmitting(false);
  }

  const { data: fallbackLicenseUrl } = useGetFallbackLicenseUrl();

  const initialValues: OpenDataFormValues = {
    resourceName: prefilledValues.resourceName,
    versionName: "",
    description: "",
    statisticStartDate: "",
    statisticEndDate: "",
    licence: fallbackLicenseUrl,
    sources: [],
    fileName: "",
    file: null,
  };

  return (
    <Formik
      key={prefilledValues.resourceName}
      initialValues={initialValues}
      onSubmit={handleSubmitNewEntry}
      validate={validateOpenDataForm}
    >
      {({ isSubmitting, handleSubmit }) => (
        <SidebarForm ref={formRef} onSubmit={handleSubmit}>
          <SidebarContent title="Datensatz anlegen">
            <OpenDataForm mode="create" />
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              left={
                <Button variant="plain" onClick={() => onClose()}>
                  Abbrechen
                </Button>
              }
              right={
                <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
