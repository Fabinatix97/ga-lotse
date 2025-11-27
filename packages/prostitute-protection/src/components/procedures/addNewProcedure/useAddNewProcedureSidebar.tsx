/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Ref, useEffect, useState } from "react";

import {
  SidebarFormHandle,
  useSearchParam,
  useSidebarFromSearchParam,
  useStepper,
} from "@eshg/lib-employee-portal";
import { durationToMinutes, useSnackbar } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiConsultationType,
  ApiCreateProstituteProtectionProcedureRequest,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

import { useCreateProcedureMutation } from "../../../api/mutations/procedures";
import { useGetAppointmentStandardDuration } from "../../../api/queries/appointmentStandardDuration";

import { AppointmentStep } from "./AppointmentStep";
import { ConsultationDetailsStep } from "./ConsultationDetailsStep";
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
    fields: ConsultationDetailsStep,
  },
  {
    title: "Neuen Vorgang anlegen",
    subTitle: "Termin",
    fields: AppointmentStep,
  },
];

export interface AddNewProcedureForm {
  firstName?: string;
  lastName?: string;
  alias: string;
  dateOfBirth?: string;
  hasSufficientGermanLanguageSkills?: boolean;
  languages: ApiPersonLanguage[];
  consultationType?: ApiConsultationType;
  customAppointmentDate: string;
  duration: number;
}

export const initialValues: AddNewProcedureForm = {
  alias: "",
  languages: [],
  customAppointmentDate: "",
  consultationType: ApiConsultationType.Initial,
  duration: 0,
};

const searchParam = "add-procedure";

export function useAddNewProcedureSidebar() {
  return useSidebarFromSearchParam({
    component: ({ formRef, onClose }) => (
      <SidebarWrapper formRef={formRef} onClose={onClose} />
    ),
    searchParam,
  });
}

function SidebarWrapper({
  formRef,
  onClose,
}: {
  formRef: Ref<SidebarFormHandle>;
  onClose: () => void;
}) {
  const [currentState, setState] = useState<AddNewProcedureForm>(initialValues);
  const snackbar = useSnackbar();
  const [_, setIsOpen] = useSearchParam(searchParam, "boolean");
  const addNewProcedure = useCreateProcedureMutation();
  const { data } = useGetAppointmentStandardDuration();

  useEffect(() => {
    if (currentState.duration) return;
    if (!data?.consultation) return;
    setState((currentState) => ({
      ...currentState,
      duration: durationToMinutes(data.consultation),
    }));
  }, [currentState.duration, data]);

  async function onFinalSubmit(newValues: AddNewProcedureForm) {
    const mappedValues = mapProcedureFormToApi(newValues);
    await addNewProcedure.mutateAsync(mappedValues);
    setIsOpen(false);
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
      isPending={false}
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
): ApiCreateProstituteProtectionProcedureRequest {
  return {
    appointmentStart: new Date(form.customAppointmentDate),
    durationInMinutes: form.duration,
    alias: form.alias,
    languages: form.languages ?? [],
    appointmentBookingType: ApiAppointmentBookingType.UserDefined,
    consultationType: form.consultationType,
  };
}
