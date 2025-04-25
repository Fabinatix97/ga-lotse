/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Divider, Radio, Sheet, Stack, Typography } from "@mui/joy";
import { Formik, FormikValues } from "formik";
import { ReactElement, useState } from "react";
import { isDefined } from "remeda";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";
import { ErrorListener } from "@/lib/configurator/components/shared/ErrorListener";
import {
  FormFields,
  RenderField,
} from "@/lib/configurator/components/shared/RenderField";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

interface FormSheet {
  title: string;
  description?: string | ReactElement;
  sections: FormSection[];
}

export interface FormSection {
  title?: string;
  description?: string | ReactElement;
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
  rows: {
    fields: FormFields[];
    footer?: string | ReactElement;
  }[];
}

function ChooseSection({
  content,
  values,
  deleteFile,
  downloadFile,
}: {
  content: ChooseSectionContent;
  values: FormikValues;
  deleteFile: (fileName: string) => void;
  downloadFile: (fileName: string) => void;
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
              deleteFile={deleteFile}
              downloadFile={downloadFile}
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
  deleteFile,
  downloadFile,
}: {
  content: FormSection["content"];
  values: FormikValues;
  deleteFile: (fileName: string) => void;
  downloadFile: (fileName: string) => void;
}) {
  switch (content.type) {
    case "choose":
      return (
        <ChooseSection
          content={content}
          values={values}
          downloadFile={downloadFile}
          deleteFile={deleteFile}
        />
      );
    case "field":
      return (
        <Stack gap={3}>
          {content.rows.map((row, index) => (
            <Stack key={`field-row-${index}`} gap={3}>
              <Stack direction="row" gap={3}>
                {row.fields.map((field) => (
                  <RenderField
                    field={field}
                    key={field.name}
                    values={values}
                    deleteFile={deleteFile}
                    downloadFile={downloadFile}
                  />
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
  onSubmit,
  status,
  deleteFile,
  downloadFile,
}: {
  sheets: FormSheet[];
  initialValues: T;
  onSubmit: (model: T) => Promise<void>;
  status?: ConfiguratorStatus;
  deleteFile?: (fileName: string) => void;
  downloadFile?: (fileName: string) => void;
}) {
  const [showError, setShowError] = useState(false);
  const { openCancelDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(model) => {
        setShowError(false);
        return onSubmit(model);
      }}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
    >
      {({ values, handleReset, isSubmitting, handleSubmit, errors, dirty }) => (
        <FormPlus data-testid="configurator-form">
          <ErrorListener
            onError={() => setShowError(true)}
            noErrors={() => setShowError(false)}
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
              {sheets.map((sheet) => (
                <Sheet key={sheet.title}>
                  <Stack gap={4}>
                    <Stack gap={1}>
                      <Typography level="h3">{sheet.title}</Typography>
                      {isDefined(sheet.description) && (
                        <>
                          {typeof sheet.description === "string" ? (
                            <Typography level="body-md">
                              {sheet.description}
                            </Typography>
                          ) : (
                            sheet.description
                          )}
                        </>
                      )}
                    </Stack>
                    {sheet.sections.map((section, index) => (
                      <Stack key={`sheet-${index}`} gap={3}>
                        {(isDefined(section.title) ||
                          isDefined(section.description)) && (
                          <Stack gap={1}>
                            {isDefined(section.title) && (
                              <Typography level="title-md">
                                {section.title}
                              </Typography>
                            )}
                            {isDefined(section.description) && (
                              <>
                                {typeof section.description === "string" ? (
                                  <Typography level="body-md">
                                    {section.description}
                                  </Typography>
                                ) : (
                                  section.description
                                )}
                              </>
                            )}
                          </Stack>
                        )}
                        <SectionContent
                          content={section.content}
                          key={`section-${index}`}
                          values={values}
                          deleteFile={(fileName) => deleteFile?.(fileName)}
                          downloadFile={(fileName) => downloadFile?.(fileName)}
                        />
                        {index + 1 !== sheet.sections.length && <Divider />}
                      </Stack>
                    ))}
                  </Stack>
                </Sheet>
              ))}
            </Stack>
            <Stack gap={3} minWidth="27rem" flex={0.33}>
              <Sheet>
                <Stack gap={3}>
                  <Typography level="h3">Hinweis</Typography>
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
                      message="Die englischsprachige Datei wurde nicht hochgeladen. Die deutsche Version wird für diese als Fallback genutzt."
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
