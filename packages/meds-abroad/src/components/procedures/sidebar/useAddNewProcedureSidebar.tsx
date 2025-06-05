/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import assert from "assert";
import { differenceInMinutes } from "date-fns";
import { Ref, useState } from "react";

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  SearchPersonFormValues,
  SidebarFormHandle,
  useSearchParamLink,
  useStepper,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue, useSnackbar } from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiCreateMedsAbroadProcedureRequest,
} from "@eshg/meds-abroad-api";

import { useCreateProcedureMutation } from "../../../api/mutations/procedures";

import { AppointmentStep } from "./AppointmentStep";
import { PersonStep } from "./PersonStep";
import { useSidebarFromSearchParam } from "./useSidebarFromSearchParam";

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

export interface AddNewProcedureForm {
  searchInputs?: SearchPersonFormValues;
  createInputs?: DefaultPersonFormValues;
  person?: ApiGetReferencePersonResponse;

  blockAppointment: null | ApiAppointment;
  appointmentBookingType: "none" | "block" | "";
}

export const initialValues: AddNewProcedureForm = {
  blockAppointment: null,
  appointmentBookingType: "",
};

export function useAddNewProcedureSidebar() {
  useSidebarFromSearchParam({
    component: ({ formRef, onClose }) => (
      <SidebarWrapper formRef={formRef} onClose={onClose} />
    ),
    searchParam: "add-procedure",
  });
  return useSearchParamLink("add-procedure", true);
}

function SidebarWrapper({
  formRef,
  onClose,
}: {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
}) {
  const [currentState, setState] = useState(initialValues);
  const snackbar = useSnackbar();
  const addNewProcedure = useCreateProcedureMutation();
  async function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    await addNewProcedure.mutateAsync(mappedValues);
    onClose();
    snackbar.confirmation("Vorgang erstellt");
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
      isPending={addNewProcedure.isPending}
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
): ApiCreateMedsAbroadProcedureRequest {
  const hasAppointment =
    form.appointmentBookingType === "block" && form.blockAppointment != null;
  const person = form.createInputs ?? form.person;
  assert.ok(person, "Person data should be defined");

  return {
    appointmentStart: hasAppointment ? form.blockAppointment?.start : undefined,
    durationInMinutes: hasAppointment
      ? differenceInMinutes(
          form.blockAppointment!.start,
          form.blockAppointment!.end,
        )
      : undefined,
    person: {
      ...person,
      salutation: mapOptionalValue(person.salutation),
      gender: mapOptionalValue(person.gender),
      countryOfBirth: mapOptionalValue(person.countryOfBirth),
      dateOfBirth: new Date(person.dateOfBirth),
    },
  };
}
