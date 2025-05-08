/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import { Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  ApiEditorElementAnswer,
  ApiEditorElementQA,
  ApiUpdateEditorRequest,
} from "@eshg/lib-editor-api";
import { FormButtonBar } from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";

interface ContentElementQAEditorProps {
  element: ApiEditorElementQA;
  onUpdate: (request: ApiUpdateEditorRequest) => Promise<boolean>;
}

export function ContentElementQAEditor({
  element,
  onUpdate,
}: Readonly<ContentElementQAEditorProps>) {
  async function handleSubmit(values: ApiEditorElementQA) {
    // Update all the answer extraTexts one by one.
    // There's currently no api to update them all in one request.
    // That's ok, because it's only about 2 to 10 small answer texts.
    for (const answer of values.answers) {
      const originalAnswer = element.answers.find(
        (e) => e.answerId === answer.answerId,
      );
      if (answer.extraText !== originalAnswer?.extraText) {
        const success = await onUpdate({
          answerId: answer.answerId,
          text: answer.extraText ?? "",
        });
        // TODO: show error that update could not be saved
        if (!success) break;
      }
    }
  }

  return (
    <Formik initialValues={element} enableReinitialize onSubmit={handleSubmit}>
      {({ values, isSubmitting, dirty }) => (
        <FormPlus>
          <Stack gap={2}>
            <Typography level="title-md">Bemerkungen</Typography>
            {values.answers.map((answer, index) => (
              <TextareaField
                key={`${values.id}.${answer.answerId}`}
                name={`answers.${index}.extraText`}
                label={<AnswerLabel answer={answer} />}
              />
            ))}
            <Divider />
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              submitDisabled={!dirty}
            />
          </Stack>
        </FormPlus>
      )}
    </Formik>
  );
}

function AnswerLabel({ answer }: Readonly<{ answer: ApiEditorElementAnswer }>) {
  return (
    <Typography>
      für:{" "}
      <Typography
        startDecorator={
          answer.selected ? <CheckBox /> : <CheckBoxOutlineBlank />
        }
      >
        {answer.answerText}
      </Typography>
    </Typography>
  );
}
