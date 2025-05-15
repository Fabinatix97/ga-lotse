/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";

import { ButtonBar } from "../../../../components/buttons/ButtonBar";

export interface DeletionRequestValues {
  reason: string;
}

interface DeletionRequestFormProps {
  onSubmit: (values: DeletionRequestValues) => Promise<void>;
  onCancel: () => void;
}

const LABELS = {
  submit: "Ja, beantragen",
  cancel: "Abbrechen",
};

const INITIAL_VALUES: DeletionRequestValues = {
  reason: "",
};

export function DeletionRequestForm(props: DeletionRequestFormProps) {
  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={props.onSubmit}>
      {({ isSubmitting }) => (
        <Stack component={FormPlus} gap={3}>
          <TextareaField
            name="reason"
            label="Begründung"
            required="Bitte eine Begründung angeben."
          />
          <ButtonBar
            right={[
              <Button
                key={LABELS.cancel}
                color="neutral"
                variant="soft"
                onClick={props.onCancel}
              >
                {LABELS.cancel}
              </Button>,
              <SubmitButton
                key={LABELS.submit}
                color="danger"
                submitting={isSubmitting}
              >
                {LABELS.submit}
              </SubmitButton>,
            ]}
          />
        </Stack>
      )}
    </Formik>
  );
}
