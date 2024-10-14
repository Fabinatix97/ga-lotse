/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiAssignableService,
  ApiProcedureStepService,
} from "@eshg/employee-portal-api/travelMedicine";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { format, isAfter } from "date-fns";
import { Formik, FormikErrors } from "formik";

import {
  PatchAppointmentRequest,
  usePatchAppointment,
} from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";
import { useAddProcedureStep } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllAppointmentTypesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import { useGetProcedureStepServices } from "@/lib/businessModules/travelMedicine/api/queries/procedureSteps";
import { useGetAllAssignableServices } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { AppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/AppointmentRadioGroup";
import {
  CheckboxGroup,
  Mode as CheckboxGroupMode,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CheckboxGroup";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { mapDateTimeToInput } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export enum Mode {
  create,
  edit,
}

export interface ServiceAppointmentValues {
  procedureId: string;
  serviceChecks?: ApiAssignableService[];
  bookingType?: ApiAppointmentBookingType;
  appointmentBlockDate?: string;
  userDefinedAppointmentDate?: string;
  appointmentTypeStandardDuration: number;
  procedureStepId: string;
  appointmentType?: ApiAppointmentType;
  appointment?: Date;
}

export const initialServiceAppointmentValues = {
  procedureId: "",
  serviceChecks: [],
  bookingType: "" as ApiAppointmentBookingType,
  appointmentBlockDate: "",
  userDefinedAppointmentDate: "",
  appointmentTypeStandardDuration: 0,
  procedureStepId: "",
  appointmentType: "" as ApiAppointmentType,
  appointment: new Date(""),
};

interface ServiceAppointmentSidebarProps {
  open: boolean;
  initialValues: ServiceAppointmentValues;
  /** The mode to open the sidebar in, either `create` or `edit`. The default is `create` */
  mode: Mode;
  onSuccess: () => void;
  onCancel: (
    currentValues: ServiceAppointmentValues,
    initialValues: ServiceAppointmentValues,
    dirty: boolean,
  ) => void;
  onClose: (item: VaccinationConsultationSidebarsProps) => void;
}

export function ServiceAppointmentSidebar(
  props: Readonly<ServiceAppointmentSidebarProps>,
) {
  const addProcedure = useAddProcedureStep();
  const patchProcedure = usePatchAppointment();

  const procedureStepServicesResponse = useGetProcedureStepServices(
    props.initialValues.procedureStepId,
    props.open,
  );
  const procedureStepServices =
    procedureStepServicesResponse.data?.procedureStepServices ??
    ([] as ApiProcedureStepService[]);

  const getAssignableServices = useGetAllAssignableServices(
    props.initialValues.procedureId,
    props.open,
  );
  const allAssignableServices = getAssignableServices.data ?? [];

  const getAllAppointmentTypes = useGetAllAppointmentTypesUnsuspended(
    props.open,
  );
  const vaccinationStandardDuration = getAllAppointmentTypes.data
    ? getAllAppointmentTypes.data.find(
        (type) => type.appointmentTypeDto == ApiAppointmentType.Vaccination,
      )!.standardDurationInMinutes
    : "";

  function createUseAddProcedureRequest(values: ServiceAppointmentValues) {
    const services: string[] = [];
    values.serviceChecks?.forEach((value) => {
      services.push(value.serviceId);
    });

    const { appointmentStart, durationInMinutes } =
      calcAppointmentDetails(values);

    const apiPostProcedureStepRequest = {
      services: services,
      appointmentBookingType: values.bookingType!,
      appointmentStart: appointmentStart,
      durationInMinutes: durationInMinutes,
    };

    return { procedureId: values.procedureId, apiPostProcedureStepRequest };
  }

  function calcAppointmentDetails(values: ServiceAppointmentValues) {
    let appointmentStart: Date;
    let durationInMinutes: number;
    if (values.bookingType == ApiAppointmentBookingType.UserDefined) {
      appointmentStart = new Date(values.userDefinedAppointmentDate!);
      durationInMinutes = values.appointmentTypeStandardDuration;
    } else {
      const split = values.appointmentBlockDate!.split(",");
      appointmentStart = new Date(split.at(0)!);
      durationInMinutes = Number.parseInt(split.at(1)!);
    }
    return { appointmentStart, durationInMinutes };
  }

  function createUsePatchAppointmentRequest(values: ServiceAppointmentValues) {
    const { appointmentStart, durationInMinutes } =
      calcAppointmentDetails(values);

    const request: PatchAppointmentRequest = {
      procedureStepId: props.initialValues.procedureStepId,
      apiPatchAppointmentRequest: {
        appointmentType: values.appointmentType!,
        appointmentBookingType: values.bookingType!,
        appointmentStart: appointmentStart,
        durationInMinutes: durationInMinutes,
      },
    };
    return {
      request,
    };
  }

  async function handleSubmit(values: ServiceAppointmentValues) {
    if (props.mode === Mode.create) {
      const useAddProcedureRequest = createUseAddProcedureRequest(values);
      await addProcedure
        .mutateAsync(useAddProcedureRequest, {
          onSuccess: props.onSuccess,
        })
        .catch();
    } else if (props.mode === Mode.edit) {
      const usePatchAppointment = createUsePatchAppointmentRequest(values);

      await patchProcedure
        .mutateAsync(usePatchAppointment.request, {
          onSuccess: props.onSuccess,
        })
        .catch();
    }
  }

  function validateForm(values: ServiceAppointmentValues) {
    const errors: FormikErrors<ServiceAppointmentValues> = {};
    if (
      values.bookingType === ApiAppointmentBookingType.AppointmentBlock &&
      values.appointmentBlockDate === ""
    ) {
      errors.appointmentBlockDate = "Bitte einen Termin auswählen";
    } else if (values.bookingType === ApiAppointmentBookingType.UserDefined) {
      if (values.userDefinedAppointmentDate === "") {
        errors.userDefinedAppointmentDate =
          "Bitte eine Datum und eine Uhrzeit auswählen";
      }
      if (values.appointmentTypeStandardDuration < 1) {
        errors.appointmentTypeStandardDuration =
          "Bitte eine positive Zahl eingeben";
      }
    }

    return errors;
  }

  function handleServiceChecksChange(
    values: ApiAssignableService[],
    setFieldValue: (
      field: string,
      value: string,
    ) => Promise<void | FormikErrors<ServiceAppointmentValues>>,
  ) {
    let earliestDate = new Date();
    void setFieldValue(
      "userDefinedAppointmentDate",
      format(earliestDate, "yyyy-MM-dd'T'HH:mm"),
    );
    values.forEach((value) => {
      if (
        value.appointmentSuggestion != undefined &&
        isAfter(value.appointmentSuggestion, earliestDate)
      ) {
        earliestDate = value.appointmentSuggestion;
        earliestDate.setUTCHours(9);
        void setFieldValue(
          "userDefinedAppointmentDate",
          earliestDate.toISOString().slice(0, 16),
        );
      }
    });
  }

  function getAppointmentBlockSelectOption(): SelectOption | undefined {
    if (
      props.mode === Mode.create ||
      props.initialValues.bookingType !==
        ApiAppointmentBookingType.AppointmentBlock
    ) {
      return undefined;
    } else {
      return {
        label: formatDateTime(props.initialValues.appointment) + " Uhr",
        value:
          props.initialValues.appointment?.toISOString() +
          "," +
          props.initialValues.appointmentTypeStandardDuration,
      };
    }
  }

  return (
    <Formik
      initialValues={{
        ...props.initialValues,
        appointmentTypeStandardDuration: vaccinationStandardDuration as number,
        procedureStepServices: procedureStepServices ?? [],
        userDefinedAppointmentDate:
          props.mode === Mode.create
            ? format(new Date(), "yyyy-MM-dd'T'HH:mm")
            : mapDateTimeToInput(props.initialValues.appointment!, false),
        appointmentBlockDate:
          props.mode === Mode.create
            ? ""
            : props.initialValues.bookingType ==
                ApiAppointmentBookingType.AppointmentBlock
              ? props.initialValues.appointment?.toISOString() +
                "," +
                props.initialValues.appointmentTypeStandardDuration
              : "",
      }}
      onSubmit={handleSubmit}
      enableReinitialize
      validate={validateForm}
    >
      {({ isSubmitting, setFieldValue, values, dirty }) => (
        <Sidebar
          onClose={() => {
            props.onClose({
              open: false,
              mode: props.mode,
              initialValues:
                props.mode === Mode.create
                  ? { ...values }
                  : initialServiceAppointmentValues,
            });
          }}
          open={props.open}
        >
          <SidebarForm style={{ display: "contents" }}>
            <SidebarContent
              title={
                props.mode === Mode.create
                  ? "Impftermin"
                  : "Impftermin bearbeiten"
              }
            >
              <Stack direction="column" gap={2}>
                {props.mode === Mode.create ? (
                  <Stack gap={2}>
                    <CheckboxGroup
                      mode={CheckboxGroupMode.assignableService}
                      name={`serviceChecks`}
                      element={allAssignableServices}
                      label={"Impfung"}
                      onChange={(services) =>
                        handleServiceChecksChange(services, setFieldValue)
                      }
                    />
                  </Stack>
                ) : (
                  <Stack gap={2}>
                    <Typography
                      level="body-md"
                      sx={{ fontWeight: "bold", mt: 2 }}
                    >
                      Impfungen
                    </Typography>
                    {procedureStepServices && (
                      <List sx={{ padding: 0 }}>
                        {procedureStepServices.map((service, index) => (
                          <ListItem key={index} sx={{ padding: 0 }}>
                            {`${service.serviceDescription}${service.vaccinationNumber ? ` - Nr. ${service.vaccinationNumber}` : ""}`}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Stack>
                )}

                <AppointmentRadioGroup
                  type={props.initialValues.appointmentType}
                  appointmentBlockDateOption={getAppointmentBlockSelectOption()}
                />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel={
                  props.mode === Mode.create ? "Erstellen" : "Speichern"
                }
                submitting={isSubmitting}
                onCancel={() => {
                  props.onCancel(values, props.initialValues, dirty);
                }}
              />
            </SidebarActions>
          </SidebarForm>
        </Sidebar>
      )}
    </Formik>
  );
}
