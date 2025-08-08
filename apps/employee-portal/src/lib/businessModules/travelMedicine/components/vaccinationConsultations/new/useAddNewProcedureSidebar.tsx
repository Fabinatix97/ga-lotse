/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { differenceInMinutes } from "date-fns";
import { Ref, useState } from "react";
import { isDefined, isNullish } from "remeda";

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  SearchPersonFormValues,
  SidebarFormHandle,
  isDomesticAddress,
  mapBaseAddressToApi,
  useSidebarFromSearchParam,
  useStepper,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue, mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiPostVaccinationConsultationRequest,
  ApiTravelType,
} from "@eshg/travel-medicine-api";

import { useSaveVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";

import { AppointmentStep } from "./AppointmentStep";
import { PersonStep } from "./PersonStep";

export interface FieldProps {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
  handleNext: (newValues: AddNewProcedureForm) => Promise<unknown> | void;
  handlePrev: () => void;
  changeToStep: (index: number) => void;
  isOnFirstStep: boolean;
  isOnLastStep: boolean;
  currentState: AddNewProcedureForm;
  isPending: boolean;
  title: string;
  subTitle?: string;
}

const steps = [
  {
    title: "Neuen Vorgang anlegen",
    fields: PersonStep,
  },
  {
    title: "Neuen Vorgang anlegen",
    subTitle: "Termin",
    fields: AppointmentStep,
  },
];

interface AddNewProcedureForm {
  searchInputs?: SearchPersonFormValues;
  createInputs?: DefaultPersonFormValues;
  person?: ApiGetReferencePersonResponse;

  appointmentType: ApiAppointmentType;

  appointmentBookingType: ApiAppointmentBookingType | "";
  blockAppointment: null | ApiAppointment;

  userDefinedAppointmentDate: string;
  appointmentTypeStandardDuration: OptionalFieldValue<number>;
}

const initialValues: AddNewProcedureForm = {
  appointmentType: ApiAppointmentType.Consultation,
  appointmentBookingType: "",
  blockAppointment: null,

  userDefinedAppointmentDate: "",
  appointmentTypeStandardDuration: "",
};

export function useAddNewProcedureSidebar() {
  return useSidebarFromSearchParam({
    component: ({ formRef, onClose }) => (
      <SidebarWrapper formRef={formRef} onClose={onClose} />
    ),
    searchParam: "add-procedure",
  });
}

function SidebarWrapper({
  formRef,
  onClose,
}: {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
}) {
  const [currentState, setState] = useState(initialValues);
  const saveVaccinationConsultation = useSaveVaccinationConsultation();

  function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    return saveVaccinationConsultation.mutateAsync(mappedValues);
  }

  function onNext(newValues: AddNewProcedureForm) {
    setState(newValues);
  }

  const {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    isOnFirstStep,
    isOnLastStep,
    step,
  } = useStepper({ steps, onFinalSubmit, onNext });

  return (
    <Fields
      title={step.title}
      subTitle={step.subTitle}
      currentState={currentState}
      isPending={saveVaccinationConsultation.isPending}
      formRef={formRef}
      isOnLastStep={isOnLastStep}
      isOnFirstStep={isOnFirstStep}
      handleNext={handleNext}
      handlePrev={handlePrev}
      changeToStep={changeToStep}
      onClose={onClose}
    />
  );
}

function mapProcedureFormToApi(
  form: AddNewProcedureForm,
): ApiPostVaccinationConsultationRequest {
  if (!form.appointmentBookingType) {
    throw Error("Appointment type must be defined");
  }
  const isBlock =
    form.appointmentBookingType === ApiAppointmentBookingType.AppointmentBlock;
  const request: Omit<ApiPostVaccinationConsultationRequest, "patient"> = {
    appointmentStart: isBlock
      ? form.blockAppointment!.start
      : new Date(form.userDefinedAppointmentDate),
    durationInMinutes: isBlock
      ? differenceInMinutes(
          form.blockAppointment!.end,
          form.blockAppointment!.start,
        )
      : (form.appointmentTypeStandardDuration as number),
    initialStepAppointmentType: form.appointmentType,
    appointmentBookingType: form.appointmentBookingType,
    travelType: ApiTravelType.Unspecified,
    travelDestinations: [],
  };
  // User is creating a new person
  if (form.createInputs) {
    const address = mapBaseAddressToApi(form.createInputs.contactAddress);
    if (!isNullish(address) && !isDomesticAddress(address)) {
      throw Error("No Postboxes allowed");
    }
    return {
      ...request,
      patient: {
        ...form.createInputs,
        address,
        differentBillingAddress: undefined,
        firstName: form.createInputs.firstName,
        lastName: form.createInputs.lastName,
        salutation: mapOptionalValue(form.createInputs.salutation),
        gender: mapOptionalValue(form.createInputs.gender),
        countryOfBirth: mapOptionalValue(form.createInputs.countryOfBirth),
        dateOfBirth: new Date(form.createInputs.dateOfBirth),
        placeOfBirth: mapOptionalValue(form.createInputs.placeOfBirth?.trim()),
        title: mapOptionalValue(form.createInputs.title?.trim()),
        phoneNumbers: form.createInputs.phoneNumbers
          .map(mapOptionalValue)
          .filter(isDefined),
        emailAddresses: form.createInputs.emailAddresses
          .map(mapOptionalValue)
          .filter(isDefined),
        nameAtBirth: mapOptionalValue(form.createInputs.nameAtBirth?.trim()),
      },
    };
  }
  // User selected an existing person
  if (form.person) {
    return {
      ...request,
      patient: {
        firstName: form.person.firstName,
        lastName: form.person.lastName,
        dateOfBirth: new Date(form.person.dateOfBirth),
      },
    };
  }

  throw Error("Person data must be defined");
}
