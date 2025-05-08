/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { Formik } from "formik";
import { useMemo, useRef } from "react";

import {
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useCreateTextBlock,
  useUpdateTextBlock,
} from "@/lib/businessModules/inspection/api/mutations/textblocks";

interface TextBlockSidebarProps {
  open: boolean;
  onClose: () => void;
  id?: string;
  name: string;
  content: string;
}

interface TextBlockFormType {
  name: string;
  content: string;
}

export function EditTextBlockSidebar(props: TextBlockSidebarProps) {
  return (
    <OverlayBoundary>
      <EditTextBlockSidebarWithQueriesAndMutations {...props} />
    </OverlayBoundary>
  );
}

function EditTextBlockSidebarWithQueriesAndMutations({
  open,
  onClose,
  id,
  name,
  content,
}: Readonly<TextBlockSidebarProps>) {
  const snackbar = useSnackbar();
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const { mutateAsync: createTextBlock } = useCreateTextBlock();

  const { mutateAsync: updateTextBlock } = useUpdateTextBlock();

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }

  async function handleSubmit(formValues: TextBlockFormType) {
    const payload = {
      id: id ?? "",
      name: formValues.name,
      content: formValues.content,
    };
    if (!id) {
      await createTextBlock(payload, {
        onSuccess: () => {
          snackbar.confirmation("Textbaustein wurde erzeugt.");
          handleClose();
        },
      });
    } else {
      await updateTextBlock(
        {
          textBlockId: id,
          apiTextBlockRequest: payload,
        },
        {
          onSuccess: () => {
            snackbar.confirmation("Textbaustein wurde gespeichert.");
            handleClose();
          },
        },
      );
    }
  }

  const initialValues: TextBlockFormType = useMemo(() => {
    return {
      id,
      name,
      content,
    };
  }, [id, name, content]);

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm ref={sidebarFormRef} onSubmit={handleSubmit}>
            <SidebarContent
              title={id ? "Textbaustein bearbeiten" : "Textbaustein erstellen"}
            >
              <Grid
                container
                component={FormPlus}
                spacing={1}
                sx={{ flexGrow: 1 }}
              >
                <Grid xxs={12}>
                  <InputField
                    name="name"
                    type="text"
                    label="Name"
                    required="Bitte einen Namen eingeben"
                  />
                </Grid>
                <Grid xxs={12}>
                  <TextareaField
                    name="content"
                    label="Inhalt"
                    required="Bitte einen Inhalt definieren"
                  />
                </Grid>
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitting={isSubmitting}
                submitLabel="Speichern"
                onCancel={handleClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
