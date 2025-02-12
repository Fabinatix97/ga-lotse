/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChecklistDefinition,
  ApiChecklistDefinitionCentralRepoRequest,
} from "@eshg/inspection-api";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRef } from "react";
import { isNonNullish } from "remeda";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import {
  useAddChecklistDefinitionToCentralRepo,
  useUpdateChecklistDefinitionToCentralRepo,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface UploadChecklistToRepoSidebarProps {
  open: boolean;
  onClose: () => void;
  checklistDefinition?: ApiChecklistDefinition;
  create: boolean;
}

type FormType = ApiChecklistDefinitionCentralRepoRequest;

export function UploadChecklistToRepoSidebar(
  props: UploadChecklistToRepoSidebarProps,
) {
  return (
    <OverlayBoundary>
      <UploadChecklistToRepoSidebarWithMutations {...props} />
    </OverlayBoundary>
  );
}

function UploadChecklistToRepoSidebarWithMutations({
  open,
  onClose,
  checklistDefinition,
  create,
}: Readonly<UploadChecklistToRepoSidebarProps>) {
  const { data: selfUser } = useGetSelfUser();
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const INITIAL_VALUES: FormType = {
    contact: `${formatPersonName(selfUser)} (${selfUser.email})`,
    description: "",
    changeLog: "",
  };

  function handleClose() {
    onClose();
  }

  const { mutateAsync: addChecklistDefinitionToCentralRepo } =
    useAddChecklistDefinitionToCentralRepo();
  const { mutateAsync: updateChecklistDefinitionToCentralRepo } =
    useUpdateChecklistDefinitionToCentralRepo();

  async function handleSubmit(formValues: FormType) {
    if (isNonNullish(checklistDefinition)) {
      if (create) {
        await addChecklistDefinitionToCentralRepo({
          cldId: checklistDefinition.id,
          cldVersion: checklistDefinition.mostRecentVersion.context.version,
          apiChecklistDefinitionCentralRepoRequest: formValues,
        });
      } else {
        await updateChecklistDefinitionToCentralRepo({
          cldId: checklistDefinition.id,
          cldVersion: checklistDefinition.mostRecentVersion.context.version,
          apiChecklistDefinitionCentralRepoUpdateRequest: formValues,
        });
      }
      sidebarFormRef.current?.resetForm();
    }
    handleClose();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit} ref={sidebarFormRef}>
            <SidebarContent
              title={
                create ? "Checkliste hochladen" : "Checkliste aktualisieren"
              }
            >
              <Stack direction="column" spacing={2}>
                <InputField
                  name="contact"
                  label="Kontakt"
                  required={create ? "Bitte einen Kontakt angeben." : undefined}
                />
                <TextareaField
                  name={"description"}
                  label={"Beschreibung"}
                  required={
                    create ? "Bitte eine Beschreibung angeben." : undefined
                  }
                />
                <TextareaField name={"changeLog"} label={"Änderungshinweis"} />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={create ? "Hinzufügen" : "Aktualisieren"}
                submitting={isSubmitting}
                onCancel={handleClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
