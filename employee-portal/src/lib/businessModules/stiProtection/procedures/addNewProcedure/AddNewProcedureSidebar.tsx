/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateProcedureResponse } from "@eshg/employee-portal-api/schoolEntry";
import {
  ApiConcern,
  ApiCountryCode,
  ApiCreateProcedureRequest,
  ApiGender,
} from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useReducer } from "react";

import { useCreateStiProcedureMutation } from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { COUNTRY_CODE_OPTIONS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SelectableCardsField } from "@/lib/shared/components/formFields/SelectableCardsField";
import { GENDER_OPTIONS } from "@/lib/shared/components/personSidebar/constants";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

import { AppointmentForm } from "./AppointmentForm";
import { PersonalDataForm } from "./PersonalDataForm";
import { SummaryForm, SummaryFormProps } from "./SummaryForm";

export const CONCERN_OPTIONS = Object.entries(CONCERN_VALUES).map(
  ([value, label]) => ({
    content: <b>{label}</b>,
    value: value as ApiConcern,
  }),
);

const steps = [
  {
    subTitle: "Anliegen auswählen",
    fields: () => (
      <SelectableCardsField
        name="concern"
        required="Bitte ein Anliegen auswählen"
        options={CONCERN_OPTIONS}
      />
    ),
  },
  {
    subTitle: "Termin wählen",
    fields: () => <AppointmentForm />,
  },
  {
    subTitle: "Persönliche Daten erfassen",
    fields: () => <PersonalDataForm />,
  },
  {
    subTitle: "Überprüfen und bestätigen",
    fields: (props: SummaryFormProps) => <SummaryForm {...props} />,
  },
];

const initialValues: AddNewProcedureForm = {
  concern: "",

  appointmentType: "",
  blockAppointment: null,
  customAppointmentDate: "",
  customAppointmentDuration: "",

  gender: "",
  countryOfBirth: "",
  inGermanySince: "",
  yearOfBirth: "",
};

export interface AddNewProcedureForm {
  concern?: ApiConcern | "";

  appointmentType?: string;
  blockAppointment?: null | Date;
  customAppointmentDate: "" | Date;
  customAppointmentDuration: string;

  gender: ApiGender | "";
  countryOfBirth?: ApiCountryCode | "";
  inGermanySince?: string;
  yearOfBirth?: string;
}

export function AddNewProcedureSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useSearchParam("add-procedure", "boolean");
  const lastStepIndex = steps.length - 1;
  const [stepIndex, changeToStep] = useReducer(
    (_index: number, newIndex: number) =>
      Math.max(Math.min(newIndex, lastStepIndex), 0),
    0,
  );

  const step = steps[stepIndex]!;

  const snackbar = useSnackbar();
  const addNewProcedure = useCreateStiProcedureMutation({
    onSuccess: (data: ApiCreateProcedureResponse) => {
      setIsOpen(false);
      snackbar.confirmation("Vorgang angelegt");
      router.push(routes.procedures.byId(data.procedureId).details);
    },
  });

  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => {
      setIsOpen(false);
      changeToStep(0);
    },
  });

  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;

  function handleNext(
    newValues: AddNewProcedureForm,
    _helpers: FormikHelpers<AddNewProcedureForm>,
  ) {
    if (isOnLastStep) {
      addNewProcedure.mutate(mapFormToApi(newValues));
      return;
    }
    changeToStep(stepIndex + 1);
  }
  const Fields = step.fields;

  return (
    <Sidebar open={isOpen} onClose={handleClose}>
      <Formik initialValues={initialValues} onSubmit={handleNext}>
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent
            title="Neuen Vorgang anlegen"
            subtitle={step.subTitle}
          >
            <Fields
              jumpToAppointmentSelection={() => {
                changeToStep(1);
              }}
              jumpToPersonalData={() => {
                changeToStep(2);
              }}
            />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={addNewProcedure.isPending}
              onCancel={handleClose}
              onBack={
                isOnFirstStep ? undefined : () => changeToStep(stepIndex - 1)
              }
              submitLabel={isOnLastStep ? "Vorgang anlegen" : "Weiter"}
            />
          </SidebarActions>
        </SidebarForm>
      </Formik>
    </Sidebar>
  );
}

function optionalInt(num: string | undefined): number | undefined {
  if (num == null) {
    return;
  }
  const parsed = parseInt(num, 10);
  return !isNaN(parsed) ? parsed : undefined;
}

type NoUndefined<T> = T extends object
  ? {
      [K in keyof T]: Exclude<T[K], undefined>;
    }
  : never;
function deleteUndefined<T extends object>(obj: T): NoUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_key, value]) => value !== undefined),
  ) as NoUndefined<T>;
}

export function mapOptional<T, K>(
  val: T | undefined | null,
  predicate: (t: T) => K,
): K | undefined {
  if (val == null) {
    return;
  }
  return predicate(val);
}

function mapFormToApi(form: AddNewProcedureForm): ApiCreateProcedureRequest {
  if (!form.yearOfBirth) {
    throw new Error("Year of birth must be defined");
  }
  return deleteUndefined({
    concern: CONCERN_OPTIONS.find((t) => t.value === form.concern)?.value,
    countryOfBirth: COUNTRY_CODE_OPTIONS.find(
      (t) => t.value === form.countryOfBirth,
    )?.value,
    gender: GENDER_OPTIONS.find((t) => t.value === form.gender)?.value as
      | ApiGender
      | undefined,
    inGermanySince: optionalInt(form.inGermanySince),
    yearOfBirth: parseInt(form.yearOfBirth, 10),
  });
}

export function getAppointmentDate(form: AddNewProcedureForm) {
  const customAppointmentDate =
    form.customAppointmentDate !== ""
      ? new Date(form.customAppointmentDate)
      : undefined;
  const date =
    form.appointmentType === "APPOINTMENT_BLOCK"
      ? form.blockAppointment
      : customAppointmentDate;
  return date ?? undefined;
}
