/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { ApiUpdateEditorRequest } from "@eshg/lib-editor-api";
import { FormButtonBar, TextareaField } from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";

interface ContentElementTextEditorProps {
  title: string;
  text: string;
  onUpdate: (request: ApiUpdateEditorRequest) => Promise<boolean>;
}

export function ContentElementFullTextEditor({
  title,
  text,
  onUpdate,
}: Readonly<ContentElementTextEditorProps>) {
  const initialValues = { title, text };

  async function handleSubmit({
    title,
    text,
  }: {
    title: string;
    text: string;
  }) {
    await onUpdate({ title, text });
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty }) => (
        <FormPlus>
          <Stack gap={2}>
            <Typography level="title-md">Content</Typography>
            <TextareaField
              name="title"
              label="Titel"
              required="Der Titel darf nicht leer bleiben"
            />
            <TextareaField
              name="text"
              label="Text"
              required="Der Text darf nicht leer bleiben"
            />
            <Divider />
            <FormButtonBar
              submitLabel={"Speichern"}
              submitting={isSubmitting}
              submitDisabled={!dirty}
            />
          </Stack>
        </FormPlus>
      )}
    </Formik>
  );
}
