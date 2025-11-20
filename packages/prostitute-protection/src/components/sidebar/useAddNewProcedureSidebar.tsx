/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Ref, useState } from "react";

import {
  SidebarFormHandle,
  useSearchParam,
  useSidebarFromSearchParam,
  useStepper,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiConsultationType,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

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
  lastName: string;
  alias?: string;
  dateOfBirth?: string;
  hasSufficientGermanLanguageSkills?: boolean;
  languages?: ApiPersonLanguage[];
  consultationType?: ApiConsultationType;
  customAppointmentDate: string;
  duration: number;
}

export const initialValues: AddNewProcedureForm = {
  customAppointmentDate: "",
  lastName: "",
  duration: 30,
  languages: [],
  consultationType: ApiConsultationType.Initial,
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
  const [currentState, setState] = useState(initialValues);
  const snackbar = useSnackbar();
  const [_, setIsOpen] = useSearchParam(searchParam, "boolean");

  async function onFinalSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 500));
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
