/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Button } from "@mui/joy";
import { Formik } from "formik";

import {
  OpenDataForm,
  OpenDataFormValues,
} from "@/lib/opendata/components/OpenDataForm";
import { VersionFileCard } from "@/lib/opendata/components/VersionFileCard";
import { OpenDataVersion } from "@/lib/opendata/components/openDataColumns";
import { useUpdateVersionMetadata } from "@/lib/opendata/mutations/opendata";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import {
  ConfirmationDialogOptions,
  useConfirmationDialog,
} from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface EditEntrySidebarProps {
  version: OpenDataVersion;
  onAbort: () => void;
  onClose: () => void;
}

export function EditEntrySidebar({
  version,
  onAbort,
  onClose,
}: EditEntrySidebarProps) {
  const { data: versionData, name } = version;
  const updateVersionMetadata = useUpdateVersionMetadata();
  const { openConfirmationDialog } = useConfirmationDialog();

  function handleSubmitUpdateVersion(values: OpenDataFormValues) {
    updateVersionMetadata.mutate(
      {
        versionId: versionData.externalId,
        request: {
          version: versionData.version,
          versionName: values.versionName,
          licence: values.licence,
          description: values.description,
          sources: new Set(values.sources),
          fileName: values.fileName,
        },
      },
      { onSuccess: () => onAbort() },
    );
  }

  function handleClose(options: Pick<ConfirmationDialogOptions, "onConfirm">) {
    openConfirmationDialog({
      title: "Änderungen verwerfen?",
      description: "Möchten Sie die Änderungen wirklich verwerfen?",
      confirmLabel: "Verwerfen",
      ...options,
    });
  }

  return (
    <Sidebar open onClose={() => handleClose({ onConfirm: onClose })}>
      <Formik
        initialValues={{
          resourceName: "",
          versionName: versionData.versionName,
          description: versionData.description ?? "",
          statisticStartDate: versionData.statisticStartDate
            ? toDateString(versionData.statisticStartDate)
            : "",
          statisticEndDate: versionData.statisticEndDate
            ? toDateString(versionData.statisticEndDate)
            : "",
          licence: versionData.licence,
          sources: Array.from(versionData.sources),
          fileName: versionData.fileName,
          file: null,
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmitUpdateVersion(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title={name}>
              <OpenDataForm mode="edit">
                <VersionFileCard version={versionData} />
              </OpenDataForm>
            </SidebarContent>
            <SidebarActions>
              <ButtonBar
                left={
                  <Button
                    variant="plain"
                    onClick={() => handleClose({ onConfirm: onAbort })}
                  >
                    Abbrechen
                  </Button>
                }
                right={
                  <SubmitButton submitting={isSubmitting}>
                    Speichern
                  </SubmitButton>
                }
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
