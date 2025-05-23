/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode } from "react";

import {
  ButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal";
import {
  ApiCreateTextTemplateRequest,
  ApiTextTemplate,
  ApiTextTemplateContext,
} from "@eshg/sti-protection-api";

import { TextTemplateFields } from "./TextTemplateFields";

interface TextTemplateEditSidebarProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TextTemplateEditSidebarCreateProps
  extends TextTemplateEditSidebarProps {
  onCreate: (values: ApiCreateTextTemplateRequest) => Promise<void>;
}

interface TextTemplateEditSidebarEditProps
  extends TextTemplateEditSidebarProps {
  onUpdate: (values: ApiTextTemplate) => Promise<void>;
  initialValues: ApiTextTemplate | undefined;
}

interface InitialFormData {
  content: string;
  context: ApiTextTemplateContext | null;
  name: string;
}
const defaultValues: InitialFormData = {
  context: null,
  content: "",
  name: "",
};

export function TextTemplateEditSidebar(
  props: TextTemplateEditSidebarCreateProps,
): ReactNode;
export function TextTemplateEditSidebar(
  props: TextTemplateEditSidebarEditProps,
): ReactNode;
export function TextTemplateEditSidebar({
  title,
  isOpen,
  onClose,
  ...props
}:
  | TextTemplateEditSidebarCreateProps
  | TextTemplateEditSidebarEditProps): ReactNode {
  const initialValues =
    "initialValues" in props ? props.initialValues : defaultValues;

  if (initialValues == null) {
    return null;
  }

  return (
    <Sidebar open={isOpen} onClose={onClose}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, helpers) => {
          await ("onUpdate" in props
            ? props.onUpdate(values as ApiTextTemplate)
            : props.onCreate(values as ApiCreateTextTemplateRequest));
          helpers.resetForm();
        }}
      >
        <SidebarForm>
          <SidebarContent title={title}>
            <TextTemplateFields />
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              left={
                <Button variant="plain" onClick={onClose}>
                  Abbrechen
                </Button>
              }
              right={<SubmitButton submitting={false}>Speichern</SubmitButton>}
            />
          </SidebarActions>
        </SidebarForm>
      </Formik>
    </Sidebar>
  );
}
