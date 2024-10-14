/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiMedicalHistory } from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useEffect } from "react";

import {
  PatchMedicalHistoryRequest,
  usePatchMedicalHistory,
} from "@/lib/businessModules/travelMedicine/api/mutations/medicalHistory";
import { MedicalHistoryMultiSelectElement } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistoryMultiSelectElement";
import { MedicalHistoryRadioButtonElement } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistoryRadioButtonElement";
import { MedicalHistorySection } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistorySection";
import { MedicalHistorySectionElement } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistorySectionElement";
import { MedicalHistorySectionElements } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistorySectionElements";
import { MedicalHistorySections } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistorySections";
import { MedicalHistoryTextareaElement } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistoryTextareaElement";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

interface MedicalHistoryProps {
  medicalHistory: ApiMedicalHistory;
  readOnly?: boolean;
  onCancel: () => void;
}

export function MedicalHistory({
  medicalHistory,
  readOnly = false,
  onCancel,
}: Readonly<MedicalHistoryProps>) {
  const patchMedicalHistory = usePatchMedicalHistory();

  async function sendUpdateRequest(request: PatchMedicalHistoryRequest) {
    await patchMedicalHistory.mutateAsync(request).catch();
  }

  async function handleSubmit(changedContent: ApiMedicalHistory) {
    const request: PatchMedicalHistoryRequest = {
      medicalHistoryId: medicalHistory.id,
      request: {
        medicalHistoryContent: changedContent.medicalHistoryContent,
        note: changedContent.note,
      },
    };
    await sendUpdateRequest(request);
    onCancel();
  }

  useEffect(() => {
    if (medicalHistory.note === undefined) {
      medicalHistory.note = "";
    }
  }, [medicalHistory]);

  return (
    <Formik
      initialValues={medicalHistory}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ getFieldProps, isSubmitting, setFieldValue, resetForm }) => {
        return (
          <FormPlus>
            <MedicalHistorySections>
              {medicalHistory.medicalHistoryContent.sections.map(
                (section, sectionIndex) => (
                  <MedicalHistorySection
                    key={"Section-" + sectionIndex}
                    dataTestId={"document-section-" + sectionIndex}
                  >
                    <MedicalHistorySectionElements
                      sectionTitle={section.sectionTitle}
                    >
                      {section.sectionElements.map((element, elementIndex) => (
                        <MedicalHistorySectionElement
                          key={
                            "Section-" +
                            sectionIndex +
                            "-Element-" +
                            elementIndex
                          }
                          dataTestId={"document-element-" + elementIndex}
                        >
                          <>
                            <MedicalHistoryRadioButtonElement
                              name={
                                "medicalHistoryContent.sections[" +
                                sectionIndex +
                                "].sectionElements[" +
                                elementIndex +
                                "].elementData.answer"
                              }
                              label={element.elementData.questionText}
                              setFieldValue={setFieldValue}
                              element={element}
                              elementIndex={elementIndex}
                              sectionIndex={sectionIndex}
                              readOnly={readOnly}
                            ></MedicalHistoryRadioButtonElement>
                            {(
                              getFieldProps(
                                "medicalHistoryContent.sections[" +
                                  sectionIndex +
                                  "].sectionElements[" +
                                  elementIndex +
                                  "].elementData.answer",
                              ).value as string
                            )?.toString() === "true" && (
                              <>
                                {element.elementData.subElementMultiSelect
                                  .length > 0 && (
                                  <MedicalHistoryMultiSelectElement
                                    element={element}
                                    elementIndex={elementIndex}
                                    sectionIndex={sectionIndex}
                                    name={
                                      "medicalHistoryContent.sections[" +
                                      sectionIndex +
                                      "].sectionElements[" +
                                      elementIndex +
                                      "].elementData.subElementMultiSelect"
                                    }
                                    readOnly={readOnly}
                                  />
                                )}
                                {element.elementData.subElementText && (
                                  <Stack
                                    style={{
                                      marginLeft: 16,
                                    }}
                                  >
                                    <MedicalHistoryTextareaElement
                                      name={
                                        "medicalHistoryContent.sections[" +
                                        sectionIndex +
                                        "].sectionElements[" +
                                        elementIndex +
                                        "].elementData.subElementText.answer"
                                      }
                                      label={
                                        element.elementData.subElementText
                                          .questionText
                                      }
                                      readOnly={readOnly}
                                    ></MedicalHistoryTextareaElement>
                                  </Stack>
                                )}
                              </>
                            )}
                          </>
                        </MedicalHistorySectionElement>
                      ))}
                    </MedicalHistorySectionElements>
                  </MedicalHistorySection>
                ),
              )}
              <Stack gap={2}>
                <TextareaField
                  name={"note"}
                  label={"Bemerkung"}
                  validate={validateLength(0, 4000)}
                  placeholder={"Bemerkung"}
                  readOnly={readOnly}
                />
                {!readOnly && (
                  <FormButtonBar
                    submitLabel="Speichern"
                    submitting={isSubmitting}
                    submitDisabled={readOnly}
                    onCancel={() => {
                      resetForm();
                      onCancel();
                    }}
                  />
                )}
              </Stack>
            </MedicalHistorySections>
          </FormPlus>
        );
      }}
    </Formik>
  );
}
