/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiAssignableService,
  ApiGetAssignableServicesResponse,
  ApiProcedureStepService,
} from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
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
import { useGetProcedureStepServices } from "@/lib/businessModules/travelMedicine/api/queries/procedureSteps";
import { useGetAllAssignableServices } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { AppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/AppointmentRadioGroup";
import {
  CheckboxGroup,
  Mode as CheckboxGroupMode,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CheckboxGroup";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { mapDateTimeToInput } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export enum Mode {
  create,
  edit,
}

interface ServiceAppointmentFormProps {
  procedureId: string;
  serviceChecks?: ApiAssignableService[];
  bookingType?: ApiAppointmentBookingType | null;
  appointmentBlockDate?: string;
  userDefinedAppointmentDate?: string;
  appointmentTypeStandardDuration: number;
  procedureStepId: string;
  appointmentType?: ApiAppointmentType;
  initialAppointment?: Date;
}

interface InitServiceAppointmentFormProps extends ServiceAppointmentFormProps {
  assignableServices: ApiGetAssignableServicesResponse;
  procedureStepServices: ApiProcedureStepService[];
}

interface ServiceAppointmentSidebarProps {
  open: boolean;
  onClose: () => void;
  initialValues: ServiceAppointmentFormProps;
  /** The mode to open the sidebar in, either `create` or `edit`. The default is `create` */
  mode: Mode;
}

export function ServiceAppointmentSidebar(
  props: Readonly<ServiceAppointmentSidebarProps>,
) {
  const addProcedure = useAddProcedureStep();
  const patchProcedure = usePatchAppointment();

  const procedureStepServicesResponse = useGetProcedureStepServices(
    props.initialValues.procedureStepId,
  );

  const procedureStepServices =
    procedureStepServicesResponse.data?.procedureStepServices ??
    ([] as ApiProcedureStepService[]);

  const assignableServicesResponse = useGetAllAssignableServices(
    props.initialValues.procedureId,
  );
  const assignableServices = assignableServicesResponse.data;

  function createUseAddProcedureRequest(
    values: InitServiceAppointmentFormProps,
  ) {
    const services: string[] = [];
    values.serviceChecks?.forEach((value) => {
      services.push(value.serviceId);
    });
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

    const apiPostProcedureStepRequest = {
      services: services,
      appointmentBookingType: values.bookingType!,
      appointmentStart: appointmentStart,
      durationInMinutes: durationInMinutes,
    };

    return { procedureId: values.procedureId, apiPostProcedureStepRequest };
  }

  function createUsePatchAppointmentRequest(
    values: InitServiceAppointmentFormProps,
  ) {
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

  async function handleSubmit(values: InitServiceAppointmentFormProps) {
    if (props.mode === Mode.create) {
      const useAddProcedureRequest = createUseAddProcedureRequest(values);
      await addProcedure.mutateAsync(useAddProcedureRequest, {
        onSuccess: () => {
          props.onClose();
        },
      });
    } else if (props.mode === Mode.edit) {
      const usePatchAppointment = createUsePatchAppointmentRequest(values);

      await patchProcedure.mutateAsync(usePatchAppointment.request, {
        onSuccess: () => {
          props.onClose();
        },
      });
    }
  }

  function validateForm(values: ServiceAppointmentFormProps) {
    const errors: FormikErrors<ServiceAppointmentFormProps> = {};
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

  function handleCheckboxChange(
    values: ApiAssignableService[],
    setFieldValue: (
      field: string,
      value: string,
    ) => Promise<void | FormikErrors<InitServiceAppointmentFormProps>>,
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
        label: formatDateTime(props.initialValues.initialAppointment) + " Uhr",
        value:
          props.initialValues.initialAppointment?.toISOString() +
          "," +
          props.initialValues.appointmentTypeStandardDuration,
      };
    }
  }

  return (
    <Sidebar open={props.open} onClose={props.onClose}>
      <Formik
        initialValues={{
          ...props.initialValues,
          assignableServices,
          procedureStepServices: procedureStepServices ?? [],
          serviceChecks: [],
          bookingType:
            props.mode === Mode.create ? null : props.initialValues.bookingType,
          userDefinedAppointmentDate:
            props.mode === Mode.create
              ? format(new Date(), "yyyy-MM-dd'T'HH:mm")
              : mapDateTimeToInput(
                  props.initialValues.initialAppointment!,
                  false,
                ),
          appointmentBlockDate:
            props.mode === Mode.create
              ? ""
              : props.initialValues.bookingType ==
                  ApiAppointmentBookingType.AppointmentBlock
                ? props.initialValues.initialAppointment?.toISOString() +
                  "," +
                  props.initialValues.appointmentTypeStandardDuration
                : "",
        }}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values).then(() => resetForm());
        }}
        enableReinitialize
        validate={validateForm}
      >
        {({ isSubmitting, values, resetForm, setFieldValue }) => (
          <FormPlus style={{ display: "contents" }}>
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
                      element={values.assignableServices.assignableServices}
                      label={"Impfung"}
                      onChange={(services) =>
                        handleCheckboxChange(services, setFieldValue)
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
                  props.onClose();
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
