/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Divider, Radio, Sheet, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors, FormikValues } from "formik";
import { ReactElement, useState } from "react";
import { isDefined, isEmpty } from "remeda";

import {
  ConfirmLeaveDirtyFormEffect,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  Alert,
  AlertProps,
  FormPlus,
  RadioGroupField,
  useSnackbar,
} from "@eshg/lib-portal";

import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";
import { ErrorListener } from "@/lib/configurator/components/shared/ErrorListener";
import {
  FormFields,
  RenderField,
} from "@/lib/configurator/components/shared/RenderField";

export interface FormSheet {
  title: string;
  description?: string | ReactElement;
  sections: FormSection[];
}

export interface FormSection {
  title?: string;
  description?: string | ReactElement;
  alert?: Pick<AlertProps, "title" | "message" | "color">;
  content: ChooseSectionContent | TextSectionContent | FieldSectionContent;
}

interface ChooseSectionContent {
  type: "choose";
  name: string;
  options: {
    label: string;
    value: string;
    readonly?: boolean;
    sections: (Omit<FormSection, "content"> & {
      content: TextSectionContent | FieldSectionContent;
    })[];
  }[];
}

interface TextSectionContent {
  type: "text";
  title?: string;
  entries: {
    label: string;
    content: string;
  }[];
}

interface FieldSectionContent {
  type: "field";
  title?: string;
  rows: {
    fields: FormFields[];
    footer?: string | ReactElement;
  }[];
}

function ChooseSection({
  content,
  values,
}: {
  content: ChooseSectionContent;
  values: FormikValues;
}) {
  const selectedOption = content.options.find(
    (it) => it.sections.length > 0 && values[content.name] === it.value,
  );
  return (
    <Stack gap={4}>
      <RadioGroupField name={content.name}>
        {content.options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            readOnly={option.readonly}
          />
        ))}
      </RadioGroupField>
      {selectedOption && (
        <>
          <Divider />
          {selectedOption.sections.map((it, index) => (
            <SectionContent
              key={`radio-section-${selectedOption.value}-${index}`}
              content={it.content}
              values={values}
            />
          ))}
        </>
      )}
    </Stack>
  );
}

function SectionContent({
  content,
  values,
}: {
  content: FormSection["content"];
  values: FormikValues;
}) {
  switch (content.type) {
    case "choose":
      return <ChooseSection content={content} values={values} />;
    case "field":
      return (
        <Stack gap={3}>
          {isDefined(content.title) && (
            <Typography level="title-md">{content.title}</Typography>
          )}
          {content.rows.map((row, index) => (
            <Stack key={`field-row-${index}`} gap={3}>
              <Stack direction="row" gap={3}>
                {row.fields.map((field) => (
                  <RenderField key={field.name} field={field} />
                ))}
              </Stack>
              {row.footer}
            </Stack>
          ))}
        </Stack>
      );
    case "text":
      return (
        <Stack gap={3}>
          {isDefined(content.title) && (
            <Typography level="title-md">{content.title}</Typography>
          )}
          {content.entries.map((entry) => (
            <Stack key={`subsection-entry-${entry.label}`} gap={1}>
              <Typography fontWeight={500} fontSize={14}>
                {entry.label}
              </Typography>
              <Typography level="body-md">{entry.content}</Typography>
            </Stack>
          ))}
        </Stack>
      );
  }
}

export function ConfiguratorForm<T extends FormikValues>({
  sheets,
  initialValues,
  validate,
  onSubmit,
  status,
}: {
  sheets: FormSheet[];
  initialValues: T;
  validate?: (values: T) => void | object | Promise<FormikErrors<T>>;
  onSubmit: (model: T) => Promise<void>;
  status?: ConfiguratorStatus;
}) {
  const [showError, setShowError] = useState(false);
  const { openCancelDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
      validate={validate}
      onSubmit={async (model, helpers) => {
        setShowError(false);
        const errors = await helpers.validateForm();
        if (isEmpty(errors)) {
          await onSubmit(model);
          helpers.resetForm();
        }
      }}
    >
      {({ values, handleReset, isSubmitting, handleSubmit, errors, dirty }) => (
        <FormPlus data-testid="configurator-form">
          <ErrorListener
            noErrors={() => setShowError(false)}
            onError={() => setShowError(true)}
          />
          <ConfirmLeaveDirtyFormEffect
            confirmationDialogProps={{
              title: "Änderungen speichern?",
              color: "primary",
              description:
                "Sie haben ungespeicherte Änderungen. Möchten Sie diese speichern?",
              confirmLabel: "Speichern",
              denyLabel: "Verwerfen",
              cancelLabel: "Abbrechen",
              onConfirm: (onNavigate) => {
                handleSubmit();
                if (Object.keys(errors).length === 0) {
                  onNavigate();
                }
              },
            }}
          />
          <Stack
            gap={3}
            sx={{
              flexDirection: {
                lg: "column",
                xl: "row",
              },
            }}
          >
            <Stack gap={3} flex={1}>
              {showError && (
                <Alert
                  color="danger"
                  message="Sie müssen zuerst alle Angaben ausfüllen, bevor Sie speichern können."
                />
              )}
              {sheets.map((sheet, index) => (
                <Sheet
                  key={sheet.title}
                  role="region"
                  aria-labelledby={`region-${index}`}
                >
                  <Stack gap={4}>
                    <Stack gap={3}>
                      <Typography
                        level="h3"
                        component="h2"
                        id={`region-${index}`}
                      >
                        {sheet.title}
                      </Typography>
                      {isDefined(sheet.description) ? (
                        typeof sheet.description === "string" ? (
                          <Typography level="body-md">
                            {sheet.description}
                          </Typography>
                        ) : (
                          sheet.description
                        )
                      ) : null}
                    </Stack>
                    {sheet.sections.map((section, sectionIndex) => (
                      <Stack
                        key={`sheet-${sectionIndex}`}
                        gap={3}
                        role="group"
                        aria-label={
                          isDefined(section.title)
                            ? undefined
                            : `Sektion ${index + 1}.${sectionIndex + 1}`
                        }
                        aria-labelledby={
                          isDefined(section.title)
                            ? `section-title-${sectionIndex}`
                            : undefined
                        }
                      >
                        {(isDefined(section.title) ||
                          isDefined(section.alert) ||
                          isDefined(section.description)) && (
                          <Stack gap={1}>
                            {isDefined(section.title) && (
                              <Typography
                                level="title-md"
                                id={`section-title-${sectionIndex}`}
                                component="h3"
                              >
                                {section.title}
                              </Typography>
                            )}
                            {isDefined(section.alert) && (
                              <Alert variant="soft" {...section.alert} />
                            )}
                            {isDefined(section.description) ? (
                              typeof section.description === "string" ? (
                                <Typography level="body-md">
                                  {section.description}
                                </Typography>
                              ) : (
                                section.description
                              )
                            ) : null}
                          </Stack>
                        )}
                        <SectionContent
                          key={`section-${index}`}
                          content={section.content}
                          values={values}
                        />
                        {index + 1 !== sheet.sections.length && <Divider />}
                      </Stack>
                    ))}
                  </Stack>
                </Sheet>
              ))}
            </Stack>
            <Stack gap={3} minWidth={{ xxs: "100%", xs: "27rem" }} flex={0.33}>
              <Sheet role="region" aria-labelledby="note-label">
                <Stack gap={3}>
                  <Typography level="h3" component="h2" id="note-label">
                    Hinweis
                  </Typography>
                  {status === "COMPLETE" && (
                    <Alert
                      variant="soft"
                      color="success"
                      message="Alle Pflichtangaben sind vollständig."
                    />
                  )}
                  {status === "PARTIALLY_COMPLETE" && (
                    <Alert
                      variant="soft"
                      color="warning"
                      message="Eine englischsprachige Datei wurde nicht hochgeladen. Die deutsche Version wird für diese als Fallback genutzt."
                    />
                  )}
                  {status === "INCOMPLETE" && (
                    <Alert
                      variant="soft"
                      color="danger"
                      message="Die Anwendung darf nur produktiv genutzt werden, wenn alle Angaben vollständig befüllt sind. "
                    />
                  )}
                  <Alert
                    variant="soft"
                    color="primary"
                    message="Prüfen Sie auch die anderen Menüpunkte auf Vollständigkeit."
                  />
                </Stack>
              </Sheet>
              <Sheet>
                <Stack gap={3}>
                  <Button
                    color="primary"
                    variant="soft"
                    onClick={() => {
                      if (!dirty) {
                        snackbar.notification(
                          "Es wurden keine Änderungen zum Verwerfen erkannt.",
                        );
                        setShowError(false);
                        handleReset();
                      } else {
                        openCancelDialog({
                          title: "Änderungen wirklich verwerfen?",
                          description: "Ihre Angaben werden nicht gespeichert.",
                          onConfirm: () => {
                            setShowError(false);
                            return handleReset();
                          },
                        });
                      }
                    }}
                  >
                    Änderungen verwerfen
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Speichern
                  </Button>
                </Stack>
              </Sheet>
            </Stack>
          </Stack>
        </FormPlus>
      )}
    </Formik>
  );
}
