/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { Formik } from "formik";

import {
  ButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { ApiVersion } from "@eshg/opendata-api";

import { EntryDetailsSidebarProps } from "@/lib/opendata/components/EntryDetailsSidebar";
import {
  OpenDataForm,
  OpenDataFormValues,
  validateOpenDataForm,
} from "@/lib/opendata/components/OpenDataForm";
import { VersionFileCard } from "@/lib/opendata/components/VersionFileCard";
import { useUpdateVersionMetadata } from "@/lib/opendata/mutations/opendata";

interface EditEntrySidebarContentProps {
  version: ApiVersion;
  onAbort: () => void;
  formRef: EntryDetailsSidebarProps["formRef"];
}

export function EditEntrySidebarContent({
  version,
  onAbort,
  formRef,
}: EditEntrySidebarContentProps) {
  const updateVersionMetadata = useUpdateVersionMetadata();
  const { openCancelDialog } = useConfirmationDialog();

  function handleSubmitUpdateVersion(values: OpenDataFormValues) {
    updateVersionMetadata.mutate(
      {
        versionId: version.externalId,
        request: {
          version: version.version,
          versionName: values.versionName,
          licence: values.licence,
          description: values.description,
          sources: new Set(values.sources),
          fileName: values.fileName,
          statisticStartDate: values.statisticStartDate
            ? new Date(values.statisticStartDate)
            : undefined,
          statisticEndDate: values.statisticEndDate
            ? new Date(values.statisticEndDate)
            : undefined,
        },
      },
      { onSuccess: () => onAbort() },
    );
  }

  return (
    <Formik
      initialValues={{
        resourceName: "",
        versionName: version.versionName,
        description: version.description ?? "",
        statisticStartDate: version.statisticStartDate
          ? toDateString(version.statisticStartDate)
          : "",
        statisticEndDate: version.statisticEndDate
          ? toDateString(version.statisticEndDate)
          : "",
        licence: version.licence,
        sources: Array.from(version.sources),
        fileName: version.fileName,
        file: null,
      }}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmitUpdateVersion(values);
        setSubmitting(false);
      }}
      validate={validateOpenDataForm}
    >
      {({ isSubmitting, handleSubmit }) => (
        <SidebarForm onSubmit={handleSubmit} ref={formRef}>
          <SidebarContent title={version.versionName}>
            <OpenDataForm mode="edit">
              <VersionFileCard version={version} />
            </OpenDataForm>
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              left={
                <Button
                  variant="plain"
                  onClick={() => {
                    openCancelDialog({ onConfirm: onAbort });
                  }}
                >
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
