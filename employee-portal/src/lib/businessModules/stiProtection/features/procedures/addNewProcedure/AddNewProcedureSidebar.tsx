/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateProcedureResponse } from "@eshg/employee-portal-api/schoolEntry";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiConcern,
  ApiCountryCode,
  ApiCreateProcedureRequest,
  ApiGender,
} from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { differenceInMinutes } from "date-fns";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useReducer } from "react";

import { useCreateStiProcedureMutation } from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { COUNTRY_CODE_OPTIONS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import {
  deleteUndefined,
  optionalInt,
} from "@/lib/businessModules/stiProtection/shared/helpers";
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
import {
  PersonalDataForm,
  personalDataFormValidation,
} from "./PersonalDataForm";
import { SummaryForm, SummaryFormProps } from "./SummaryForm";

export const CONCERN_OPTIONS = Object.entries(CONCERN_VALUES).map(
  ([value, label]) => ({
    content: <b>{label}</b>,
    value: value as ApiConcern,
  }),
);

const steps = [
  {
    title: "Neuen Vorgang anlegen",
    subTitle: "Schritt 1 von 4",
    fields: () => (
      <SelectableCardsField
        name="concern"
        required="Bitte ein Anliegen auswählen"
        options={CONCERN_OPTIONS}
      />
    ),
  },
  {
    title: "Termin wählen",
    subTitle: "Schritt 2 von 4",
    fields: () => <AppointmentForm />,
  },
  {
    title: "Angaben zur Person",
    subTitle: "Schritt 3 von 4",
    fields: () => <PersonalDataForm />,
    validate: personalDataFormValidation,
  },
  {
    title: "Zusammenfassung",
    subTitle: "Schritt 4 von 4",
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

  appointmentType?: ApiAppointmentBookingType | "";
  blockAppointment?: null | ApiAppointment;
  customAppointmentDate: string;
  customAppointmentDuration: string;

  gender: ApiGender | "";
  countryOfBirth?: ApiCountryCode | "" | null;
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
      const mappedValues = mapFormToApi(newValues);
      return addNewProcedure.mutateAsync(mappedValues);
    }
    changeToStep(stepIndex + 1);
  }
  const Fields = step.fields;

  return (
    <Sidebar open={isOpen} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleNext}
        validate={step.validate}
      >
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={step.title} subtitle={step.subTitle}>
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

function mapFormToApi(form: AddNewProcedureForm): ApiCreateProcedureRequest {
  if (!form.yearOfBirth) {
    throw new Error("Year of birth must be defined");
  }
  if (!form.appointmentType) {
    throw new Error("Appointment type must be defined");
  }
  const isCustomAppointment =
    form.appointmentType === ApiAppointmentBookingType.UserDefined;

  const appointmentStart = isCustomAppointment
    ? new Date(form.customAppointmentDate)
    : form.blockAppointment?.start;

  if (!appointmentStart) {
    throw new Error("Appointment start must be defined");
  }

  const blockAppointmentEnd = form.blockAppointment?.end;
  if (!isCustomAppointment && blockAppointmentEnd == null) {
    throw new Error("Appointment end must be defined");
  }

  return deleteUndefined({
    appointmentBookingType: form.appointmentType,
    concern: CONCERN_OPTIONS.find((t) => t.value === form.concern)?.value,
    countryOfBirth: COUNTRY_CODE_OPTIONS.find(
      (t) => t.value === form.countryOfBirth,
    )?.value,
    gender: GENDER_OPTIONS.find((t) => t.value === form.gender)?.value as
      | ApiGender
      | undefined,
    durationInMinutes: isCustomAppointment
      ? optionalInt(form.customAppointmentDuration)
      : differenceInMinutes(blockAppointmentEnd!, appointmentStart),
    appointmentStart,
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
    form.appointmentType === ApiAppointmentBookingType.AppointmentBlock
      ? form.blockAppointment?.start
      : customAppointmentDate;
  return date ?? undefined;
}
