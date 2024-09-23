/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDisease,
  ApiGetAvailableAppointmentsResponse,
  ApiOtherServiceTemplate,
  ApiPostOtherServiceRequest,
  ApiPostServicesRequest,
  ApiPostVaccinationRequest,
  ApiVaccinationType,
  ApiVaccine,
} from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import { Button, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { FieldArray, Formik, FormikErrors } from "formik";
import { useState } from "react";

import {
  UsePostServicesRequest,
  usePostServices,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllAvailableAppointments } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { HorizontalFieldLabelEnd } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/HorizontalFieldLabelEnd";
import { VACCINATION_TYPE } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/options";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { LOCALE_OPTION, formatCurrency } from "@/lib/shared/helpers/numbers";
import {
  validateNonNegativeNumberWithAtMostTwoDecimalDigits,
  validatePositiveInteger,
} from "@/lib/shared/helpers/validators";

type ServicesRequest = ApiPostOtherServiceRequest &
  ApiPostVaccinationRequest & { serviceType: string; templateId: string };

export const emptyServicePlanSideBarValues: ServicesRequest = {
  serviceType: "VACCINATION",
  description: "",
  vaccinationType: ApiVaccinationType.Basic,
  diseaseId: "",
  vaccineId: "",
  fee: 0,
  createSeries: false,
  vaccinationNumber: 1,
  templateId: "",
};

interface InitServiceFormValues {
  procedureId: string;
  procedureStepId?: string;
  services: ServicesRequest[];
}

interface ServicePlanSideBarProps {
  sideBarOpen: boolean;
  closeSideBar: () => void;
  allVaccines: ApiVaccine[];
  allDiseases: ApiDisease[];
  allTemplates: ApiOtherServiceTemplate[];
  initialValues: InitServiceFormValues;
}

export function ServicePlanSideBar(props: Readonly<ServicePlanSideBarProps>) {
  const [offset, setOffset] = useState<number>();
  const postServicesApi = usePostServices();

  const allAvailableAppointments = useGetAllAvailableAppointments(
    props.initialValues.procedureId,
  );

  let selectDiseaseOptions: SelectOption[] = [{ label: "", value: "" }];
  if (props.allDiseases.length > 0) {
    selectDiseaseOptions = props.allDiseases.map((disease, idx) => {
      return {
        label: disease.name,
        value: disease.id + "," + idx,
      };
    });
  }

  const selectVaccinesOptions: SelectOption[][] = [[{ label: "", value: "" }]];
  if (props.allVaccines.length > 0) {
    selectDiseaseOptions.forEach((disease, index) => {
      const diseaseId = disease.value.split(",")[0];
      selectVaccinesOptions[index] = props.allVaccines
        .filter((vaccine) => vaccine.disease.id == diseaseId)
        .map((vaccine) => {
          return {
            label: vaccine.name,
            value: vaccine.id,
          };
        });
    });
  }

  let selectOtherServicesTemplateOptions: SelectOption[] = [
    { label: "", value: "" },
  ];
  if (props.allTemplates.length > 0) {
    selectOtherServicesTemplateOptions = props.allTemplates.map((template) => {
      return {
        label: template.description,
        value: template.id,
      };
    });
  }

  function createPostServicesRequest(values: InitServiceFormValues) {
    values.services.forEach((service) => {
      service.diseaseId = service.diseaseId.split(",")[0]!;
    });
    const apiRequest: ApiPostServicesRequest = {
      procedureStepId: values.procedureStepId,
      postVaccinationRequests: values.services.filter(
        (value) => value.serviceType === "VACCINATION",
      ),
      postOtherServiceRequests: values.services.filter(
        (value) =>
          value.serviceType === "OTHER" ||
          value.serviceType === "OTHER_TEMPLATES",
      ),
    };

    const request: UsePostServicesRequest = {
      apiRequest,
      procedureId: values.procedureId,
    };
    return request;
  }

  async function handleServiceSideBarSubmit(
    values: InitServiceFormValues,
    resetForm: () => void,
  ) {
    const request = createPostServicesRequest(values);
    await postServicesApi.mutateAsync(request, {
      onSuccess: () => {
        props.closeSideBar();
        resetForm();
      },
    });
  }

  function updateVaccineList(index: number, selectValue: string) {
    const diseaseId = selectValue.split(",")[0]!;
    selectVaccinesOptions[index] = props.allVaccines
      .filter((vaccine) => vaccine.disease.id == diseaseId)
      .map((vaccine) => {
        return {
          label: vaccine.name,
          value: vaccine.id,
        };
      });
  }

  function getVaccineOffsets(vaccineId: string) {
    if (vaccineId) {
      const vaccine = props.allVaccines.find(
        (vaccine) => vaccine.id === vaccineId,
      );
      if (vaccine) {
        return vaccine.offsets.length;
      }
    }
  }

  async function getFeeForVaccine(
    index: number,
    vaccineId: string,
    setFieldValue: (
      field: string,
      value: number,
    ) => Promise<void | FormikErrors<InitServiceFormValues>>,
  ) {
    if (vaccineId) {
      const vaccine = props.allVaccines.find(
        (vaccine) => vaccine.id === vaccineId,
      );
      if (vaccine) {
        await setFieldValue(`services.${index}.fee`, vaccine.fee ?? 0);
      }
    } else {
      await setFieldValue(`services.${index}.fee`, 0);
    }
  }

  async function getFeeForTemplate(
    index: number,
    templateId: string,
    setFieldValue: (
      field: string,
      value: number,
    ) => Promise<void | FormikErrors<InitServiceFormValues>>,
  ) {
    if (templateId) {
      const template = props.allTemplates.find(
        (template) => template.id === templateId,
      );
      if (template) {
        await setFieldValue(`services.${index}.fee`, template.fee ?? 0);
      }
    } else {
      await setFieldValue(`services.${index}.fee`, 0);
    }
  }

  async function getDescription(
    index: number,
    templateId: string,
    setFieldValue: (
      field: string,
      value: string,
    ) => Promise<void | FormikErrors<InitServiceFormValues>>,
  ) {
    if (templateId) {
      const template = props.allTemplates.find(
        (template) => template.id === templateId,
      );
      if (template) {
        await setFieldValue(
          `services.${index}.description`,
          template.description ?? "",
        );
      }
    }
  }

  function createAppointmentOptions(
    availableAppointments: ApiGetAvailableAppointmentsResponse | undefined,
  ) {
    if (availableAppointments) {
      const labelOptions: SelectOption[] =
        availableAppointments.appointmentSummaryList.map((appointment) => ({
          label: formatDateTime(appointment.start) + " Uhr",
          value: appointment.procedureStepId,
        }));

      return labelOptions;
    } else {
      return [];
    }
  }

  return (
    <Sidebar open={props.sideBarOpen} onClose={props.closeSideBar}>
      <Formik
        initialValues={{
          ...props.initialValues,
          availableAppointments: allAvailableAppointments.data,
          procedureStepId:
            allAvailableAppointments.data?.appointmentSummaryList?.at(-1)
              ?.procedureStepId,
        }}
        onSubmit={async (values, { resetForm }) => {
          await handleServiceSideBarSubmit(values, resetForm);
        }}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, resetForm }) => (
          <FormPlus style={{ display: "contents" }}>
            <SidebarContent title={"Leistung"}>
              <Stack flexDirection="column" gap={2} data-testid="appointment">
                <Typography level="body-md" sx={{ fontWeight: "bold" }}>
                  Termin
                </Typography>
                <SelectField
                  label="Termin aus Vorgang"
                  name="procedureStepId"
                  // prepend an empty option (non-selection is requested even if the select field is preset)
                  options={[
                    { label: "", value: "" },
                    ...createAppointmentOptions(values.availableAppointments),
                  ]}
                  onChange={(selected) =>
                    setFieldValue("procedureStepId", selected)
                  }
                />
                <Typography
                  level="body-md"
                  sx={{ fontWeight: "bold", paddingTop: 2 }}
                >
                  Leistungen
                </Typography>
                <FieldArray name="services">
                  {({ push, remove }) => (
                    <>
                      {values.services.map((val, index) => (
                        <Sheet key={index}>
                          <Stack
                            direction="column"
                            gap={2}
                            data-testid="services"
                          >
                            <SelectField
                              name={`services.${index}.serviceType`}
                              label="Leistungsart"
                              options={[
                                { value: "VACCINATION", label: "Impfung" },
                                { value: "OTHER", label: "Sonstiges" },
                                {
                                  value: "OTHER_TEMPLATES",
                                  label: "Vordefinierte Leistung",
                                },
                              ]}
                              required="Bitte eine Leistungsart auswählen."
                            />
                            {val.serviceType === "OTHER" ? (
                              <>
                                <TextareaField
                                  name={`services.${index}.description`}
                                  label="Beschreibung"
                                />
                                <NumberField
                                  name={`services.${index}.fee`}
                                  label="Preis in €"
                                  required="Bitte einen Preis in € angeben"
                                  validate={
                                    validateNonNegativeNumberWithAtMostTwoDecimalDigits
                                  }
                                />
                              </>
                            ) : val.serviceType === "VACCINATION" ? (
                              <>
                                <SelectField
                                  name={`services.${index}.vaccinationType`}
                                  label="Impfart"
                                  options={VACCINATION_TYPE}
                                  required="Bitte eine Impfart auswählen."
                                  onChange={() =>
                                    setFieldValue(
                                      `services.${index}.vaccinationNumber`,
                                      1,
                                    )
                                  }
                                />
                                <SelectField
                                  name={`services.${index}.diseaseId`}
                                  label="Impfung"
                                  placeholder="auswählen"
                                  options={selectDiseaseOptions}
                                  required="Bitte eine Impfung auswählen."
                                  onChange={(selectValue) => {
                                    updateVaccineList(index, selectValue);
                                  }}
                                />
                                <SelectField
                                  name={`services.${index}.vaccineId`}
                                  label="Impfstoff"
                                  placeholder="auswählen"
                                  options={
                                    selectVaccinesOptions[
                                      Number.parseInt(
                                        values.services[index]!.diseaseId.split(
                                          ",",
                                        )[1]!,
                                      )
                                    ] ?? [{ label: "", value: "" }]
                                  }
                                  required="Bitte einen Impfstoff auswählen."
                                  onChange={async (vaccineId) => {
                                    await setFieldValue(
                                      `services.${index}.createSeries`,
                                      false,
                                    );
                                    await getFeeForVaccine(
                                      index,
                                      vaccineId,
                                      setFieldValue,
                                    );
                                    setOffset(getVaccineOffsets(vaccineId));
                                  }}
                                />
                                <DetailsCell
                                  name={`services.${index}.fee`}
                                  label="Preis"
                                  value={formatCurrency(val.fee, {
                                    localOption: LOCALE_OPTION.manual,
                                    locale: "de-DE",
                                  })}
                                />
                                {val.vaccinationType !=
                                  ApiVaccinationType.Booster && (
                                  <>
                                    <Divider />
                                    <Grid
                                      container
                                      alignContent="center"
                                      justifyContent="space-between"
                                    >
                                      <Grid>
                                        {offset! > 0 && (
                                          <CheckboxField
                                            name={`services.${index}.createSeries`}
                                            label="Impfserie erstellen"
                                            sx={{
                                              pt: "8px",
                                              fontSize: "14px",
                                            }}
                                          />
                                        )}
                                      </Grid>
                                      <Grid>
                                        {!val.createSeries && (
                                          <NumberField
                                            name={`services.${index}.vaccinationNumber`}
                                            label="Nr."
                                            required="Bitte einen Anzahl angeben"
                                            component={HorizontalFieldLabelEnd}
                                            sx={{
                                              width: "60px",
                                            }}
                                            validate={validatePositiveInteger}
                                          />
                                        )}
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <SelectField
                                  name={`services.${index}.templateId`}
                                  label="Beschreibung"
                                  placeholder="auswählen"
                                  options={selectOtherServicesTemplateOptions}
                                  required="Bitte eine Beschreibung auswählen."
                                  onChange={async (templateId) => {
                                    await getDescription(
                                      index,
                                      templateId,
                                      setFieldValue,
                                    );
                                    await getFeeForTemplate(
                                      index,
                                      templateId,
                                      setFieldValue,
                                    );
                                  }}
                                />
                                <DetailsCell
                                  name={`services.${index}.fee`}
                                  label="Preis"
                                  value={formatCurrency(val.fee, {
                                    localOption: LOCALE_OPTION.manual,
                                    locale: "de-DE",
                                  })}
                                />
                              </>
                            )}
                            {index > 0 && (
                              <>
                                <Divider />
                                <Button
                                  color="danger"
                                  variant="plain"
                                  size="sm"
                                  sx={{ marginLeft: "auto" }}
                                  onClick={() => remove(index)}
                                >
                                  Leistung entfernen
                                </Button>
                              </>
                            )}
                          </Stack>
                        </Sheet>
                      ))}
                      <Button
                        startDecorator={<Add />}
                        color="primary"
                        variant="plain"
                        size="sm"
                        sx={{ marginRight: "auto" }}
                        onClick={() => {
                          push(emptyServicePlanSideBarValues);
                          selectVaccinesOptions.push(
                            selectVaccinesOptions[
                              selectVaccinesOptions.length - 1
                            ] ?? [{ label: "", value: "" }],
                          );
                        }}
                      >
                        Leistung hinzufügen
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel="Speichern"
                submitting={isSubmitting}
                onCancel={() => {
                  props.closeSideBar();
                  resetForm();
                }}
              />
            </SidebarActions>
          </FormPlus>
        )}
      </Formik>
    </Sidebar>
  );
}
