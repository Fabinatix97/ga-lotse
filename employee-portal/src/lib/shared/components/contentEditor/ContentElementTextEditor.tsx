/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateEditorRequest } from "@eshg/employee-portal-api/libEditor";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

interface ContentElementTextEditorProps {
  text: string;
  onUpdate: (request: ApiUpdateEditorRequest) => Promise<boolean>;
}

export function ContentElementTextEditor({
  text,
  onUpdate,
}: Readonly<ContentElementTextEditorProps>) {
  const initialValues = { text };

  async function handleSubmit({ text }: { text: string }) {
    await onUpdate({ text });
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
