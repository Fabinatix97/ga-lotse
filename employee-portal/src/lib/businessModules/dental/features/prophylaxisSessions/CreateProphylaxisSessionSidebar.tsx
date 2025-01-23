/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAddContact200Response } from "@eshg/base-api";
import {
  ApiCreateProphylaxisSessionRequest,
  ApiFluoridationVarnish,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { forwardRef, useEffect } from "react";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { useCreateProphylaxisSession } from "@/lib/businessModules/dental/api/mutations/prophylaxisSessionApi";
import {
  getAllDentalAssistantsQuery,
  getAllDentistsQuery,
} from "@/lib/businessModules/dental/api/queries/staff";
import { FluoridationField } from "@/lib/businessModules/dental/features/prophylaxisSessions/FluoridationField";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { PROPHYLAXIS_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { AppointmentStaffField } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffField";
import { SelectionOption } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import { SelectContactField } from "@/lib/shared/components/formFields/SelectContactField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import { getInstitutionOptionLabel } from "@/lib/shared/helpers/selectOptionMapper";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useCreateProphylaxisSessionSidebar() {
  return useSidebarWithFormRef({
    component: CreateProphylaxisSessionSidebar,
  });
}

export interface CreateProphylaxisSessionValues {
  dateAndTime: string;
  institution: ApiAddContact200Response | null;
  groupName: OptionalFieldValue<string>;
  type: OptionalFieldValue<ApiProphylaxisType>;
  screening: boolean;
  fluoridation: boolean;
  fluoridationVarnish: OptionalFieldValue<ApiFluoridationVarnish>;
  dentistIds: string[];
  zfaIds: string[];
}

function CreateProphylaxisSessionSidebar(props: SidebarWithFormRefProps) {
  const createSession = useCreateProphylaxisSession();
  const userApi = useUserApi();
  const [{ data: allDentists }, { data: allDentalAssistants }] =
    useSuspenseQueries({
      queries: [
        getAllDentistsQuery(userApi),
        getAllDentalAssistantsQuery(userApi),
      ],
    });

  const dentistOptions = allDentists.map((dentist) => ({
    value: dentist.userId,
    label: fullName(dentist),
  }));

  const dentalAssistantOptions = allDentalAssistants.map((dentalAssistant) => ({
    value: dentalAssistant.userId,
    label: fullName(dentalAssistant),
  }));

  return (
    <Formik<CreateProphylaxisSessionValues>
      initialValues={{
        dateAndTime: "",
        institution: null,
        groupName: "",
        type: "",
        screening: false,
        fluoridation: false,
        fluoridationVarnish: "",
        dentistIds: [],
        zfaIds: [],
      }}
      onSubmit={(values) =>
        createSession.mutateAsync(mapValues(values), {
          onSuccess: () => {
            props.onClose(true);
          },
        })
      }
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <CreateProphylaxisSessionSidebarForm
          ref={props.formRef}
          onSubmit={handleSubmit}
          onClose={() => props.onClose(false)}
          dentistOptions={dentistOptions}
          zfaOptions={dentalAssistantOptions}
          values={values}
          isSubmitting={isSubmitting}
          setFieldValue={setFieldValue}
        />
      )}
    </Formik>
  );
}

interface CreateProphylaxisSessionSidebarFormProps {
  onSubmit: () => void;
  values: CreateProphylaxisSessionValues;
  isSubmitting: boolean;
  onClose: () => void;
  dentistOptions: SelectionOption[];
  zfaOptions: SelectionOption[];
  setFieldValue: (field: "groupName", value: "") => void;
}

const CreateProphylaxisSessionSidebarForm = forwardRef<
  SidebarFormHandle,
  CreateProphylaxisSessionSidebarFormProps
>(function CreateProphylaxisSessionSidebarForm(
  {
    onSubmit,
    values,
    isSubmitting,
    onClose,
    dentistOptions,
    zfaOptions,
    setFieldValue,
  }: CreateProphylaxisSessionSidebarFormProps,
  ref,
) {
  const shouldClearGroupName = useHasChanged(values.institution);
  useEffect(() => {
    if (shouldClearGroupName) {
      void setFieldValue("groupName", "");
    }
  }, [shouldClearGroupName, setFieldValue, values]);

  return (
    <SidebarForm ref={ref} onSubmit={onSubmit}>
      <SidebarContent title="Prophylaxe anlegen">
        <Stack gap={3}>
          <DateTimeField
            name="dateAndTime"
            label="Datum und Uhrzeit"
            required="Bitte ein Datum mit Uhrzeit angeben."
          />
          <SelectContactField
            name="institution"
            label="Einrichtung"
            categories={SCHOOL_OR_DAYCARE}
            required="Bitte eine Schule/Kita angeben."
            getOptionLabel={getInstitutionOptionLabel}
          />
          <SearchGroupField
            name="groupName"
            label="Gruppe"
            institutionId={values.institution?.id ?? ""}
          />
          <SelectField
            name="type"
            label="Typ"
            options={PROPHYLAXIS_TYPE_OPTIONS}
            required="Bitte den Typ der Prophylaxe angeben."
          />
          <CheckboxField name="screening" label="Reihenuntersuchung" />
          <FluoridationField />
          <Typography component="h3" level="title-sm">
            Durchführende Personen
          </Typography>
          <AppointmentStaffField
            name="dentistIds"
            options={dentistOptions}
            blockedStaff={[]}
            freeStaff={[]}
            label="Zahnarzt/-ärztin"
            required="Bitte mindestens eine/n Zahnarzt/-ärztin angeben."
          />
          <AppointmentStaffField
            name="zfaIds"
            options={zfaOptions}
            blockedStaff={[]}
            freeStaff={[]}
            label="ZFA"
            required="Bitte mindestens eine/n ZFA angeben."
          />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <FormButtonBar
          submitLabel="Anlegen"
          submitting={isSubmitting}
          onCancel={() => {
            onClose();
          }}
        />
      </SidebarActions>
    </SidebarForm>
  );
});

function mapValues(
  values: CreateProphylaxisSessionValues,
): ApiCreateProphylaxisSessionRequest {
  return {
    dateAndTime: new Date(values.dateAndTime),
    institutionId: mapRequiredValue(values.institution)?.id,
    groupName: mapRequiredValue(values.groupName),
    type: mapRequiredValue(values.type),
    screening: values.screening,
    fluoridationVarnish: values.fluoridation
      ? mapRequiredValue(values.fluoridationVarnish)
      : undefined,
    dentistIds: values.dentistIds,
    zfaIds: values.zfaIds,
  };
}
