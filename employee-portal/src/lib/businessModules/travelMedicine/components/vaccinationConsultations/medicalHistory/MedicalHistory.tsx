/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { ApiMedicalHistory } from "@eshg/travel-medicine-api";
import { Box, Stack } from "@mui/joy";
import { Formik } from "formik";
import { useEffect } from "react";

import {
  PatchMedicalHistoryRequest,
  usePatchMedicalHistory,
} from "@/lib/businessModules/travelMedicine/api/mutations/medicalHistory";
import { ConfirmationElement } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/ConfirmationElement";
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
  procedureId: string;
  readOnly?: boolean;
  onCancel: () => void;
}

export function MedicalHistory({
  medicalHistory,
  procedureId,
  readOnly = false,
  onCancel,
}: Readonly<MedicalHistoryProps>) {
  const patchMedicalHistory = usePatchMedicalHistory();

  async function sendUpdateRequest(request: PatchMedicalHistoryRequest) {
    await patchMedicalHistory.mutateAsync(request);
  }

  async function handleSubmit(changedContent: ApiMedicalHistory) {
    const request: PatchMedicalHistoryRequest = {
      medicalHistoryId: medicalHistory.id,
      request: {
        procedureId: procedureId,
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
                            {element.anamnesisQuestion && (
                              <>
                                <MedicalHistoryRadioButtonElement
                                  name={
                                    "medicalHistoryContent.sections[" +
                                    sectionIndex +
                                    "].sectionElements[" +
                                    elementIndex +
                                    "].anamnesisQuestion.answer"
                                  }
                                  label={element.anamnesisQuestion.questionText}
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
                                      "].anamnesisQuestion.answer",
                                  ).value as string
                                )?.toString() === "true" && (
                                  <>
                                    {element.anamnesisQuestion
                                      .subElementMultiSelect.length > 0 && (
                                      <MedicalHistoryMultiSelectElement
                                        element={element}
                                        elementIndex={elementIndex}
                                        sectionIndex={sectionIndex}
                                        name={
                                          "medicalHistoryContent.sections[" +
                                          sectionIndex +
                                          "].sectionElements[" +
                                          elementIndex +
                                          "].anamnesisQuestion.subElementMultiSelect"
                                        }
                                        readOnly={readOnly}
                                      />
                                    )}

                                    {element.anamnesisQuestion
                                      .subElementText && (
                                      <Stack
                                        sx={{
                                          marginLeft: 2,
                                        }}
                                      >
                                        <MedicalHistoryTextareaElement
                                          name={
                                            "medicalHistoryContent.sections[" +
                                            sectionIndex +
                                            "].sectionElements[" +
                                            elementIndex +
                                            "].anamnesisQuestion.subElementText.answer"
                                          }
                                          label={
                                            element.anamnesisQuestion
                                              .subElementText.questionText
                                          }
                                          readOnly={readOnly}
                                        ></MedicalHistoryTextareaElement>
                                      </Stack>
                                    )}
                                  </>
                                )}
                              </>
                            )}

                            {element.textBlock && (
                              <Box
                                sx={{ whiteSpace: "pre-wrap" }}
                                data-testid="document-element-type-textblock"
                              >
                                {element.textBlock.textField}
                              </Box>
                            )}

                            {element.confirmation && (
                              <ConfirmationElement
                                confirmation={element.confirmation}
                                elementIndex={elementIndex}
                                sectionIndex={sectionIndex}
                                readOnly={readOnly}
                                setFieldValue={setFieldValue}
                              />
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
