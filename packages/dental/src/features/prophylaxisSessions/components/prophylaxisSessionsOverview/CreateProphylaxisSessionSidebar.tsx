/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  ApiCreateProphylaxisSessionRequest,
  ApiDentitionType,
  ApiFluoridationVarnish,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import {
  DateTimeField,
  FormButtonBar,
  SchoolYearField,
  SelectContactField,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  UserField,
  formatInstitutionNameWithCategoryShort,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  NullableFieldValue,
  OptionalFieldValue,
  SelectField,
  mapOptionalValue,
  mapRequiredValue,
  useHasChanged,
  useSnackbar,
} from "@eshg/lib-portal";

import { Institution } from "../../../../api/models/Institution";
import { useGetStaff } from "../../../../api/queries/staff";
import { SearchGroupField } from "../../../../components/group/SearchGroupField";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import { PROPHYLAXIS_TYPE_OPTIONS_WITH_DESELECTION } from "../../../../config/prophylaxisSession";
import { routes } from "../../../../config/routes";
import { useValidateOpenChildrenExistInInstitution } from "../../../children/api/queries/details";
import { useCreateProphylaxisSession } from "../../api/mutations/overview";
import { FluoridationField } from "../prophylaxisSessionDetails/FluoridationField";
import { ScreeningField } from "../prophylaxisSessionDetails/ScreeningField";

interface CreateProphylaxisSessionFormValues {
  dateAndTime: string;
  institution: NullableFieldValue<Institution>;
  groupName: OptionalFieldValue<string>;
  schoolYear: number;
  type: OptionalFieldValue<ApiProphylaxisType>;
  isScreening: boolean;
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  isFluoridation: boolean;
  fluoridationVarnish: OptionalFieldValue<ApiFluoridationVarnish>;
  dentistIds: string[];
  zfaIds: string[];
}

const INITIAL_VALUES: CreateProphylaxisSessionFormValues = {
  dateAndTime: "",
  institution: null,
  schoolYear: calculateCurrentSchoolYear(),
  groupName: "",
  type: "",
  isScreening: false,
  dentitionType: ApiDentitionType.Mixed,
  isFluoridation: false,
  fluoridationVarnish: "",
  dentistIds: [],
  zfaIds: [],
};

export function useCreateProphylaxisSessionSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: CreateProphylaxisSessionSidebar,
  });
}

function CreateProphylaxisSessionSidebar(props: SidebarWithFormRefProps) {
  const createSession = useCreateProphylaxisSession();
  const { allDentists, allDentalAssistants } = useGetStaff();
  const snackbar = useSnackbar();
  const router = useRouter();

  const form = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: onSubmit,
  });

  const shouldClearGroupName = useHasChanged(form.values.institution);
  useEffect(() => {
    if (shouldClearGroupName) {
      void form.setFieldValue("groupName", "");
    }
  }, [shouldClearGroupName, form, form.setFieldValue, form.values]);

  function onSubmit(values: CreateProphylaxisSessionFormValues) {
    createSession
      .mutateAsync(mapProphylaxisSessionFormValuesToRequest(values), {
        onSuccess: (response) => {
          props.onClose(true);
          router.push(routes.prophylaxisSessions.byId(response.id).details);
        },
      })
      .catch(() =>
        snackbar.error("Die Daten konnten nicht gespeichert werden."),
      );
  }

  const openChildrenInInstitution = useValidateOpenChildrenExistInInstitution(
    form.values.institution?.id ?? "",
    form.values.schoolYear,
  ).data;

  return (
    <FormikProvider value={form}>
      <SidebarForm ref={props.formRef}>
        <SidebarContent title="Prophylaxe anlegen">
          <Stack gap={3}>
            <DateTimeField
              name="dateAndTime"
              label="Datum und Uhrzeit"
              required="Bitte ein Datum mit Uhrzeit angeben."
            />
            <SchoolYearField
              name="schoolYear"
              label="Schuljahr"
              required="Bitte ein Schuljahr auswählen."
              range={{
                numberOfYearsInPast: 1,
                numberOfYearsInFuture: 1,
              }}
            />
            <SelectContactField
              name="institution"
              label="Einrichtung"
              placeholder="Schule/Kita suchen"
              categories={SCHOOL_OR_DAYCARE_CONTACT}
              required="Bitte eine Schule/Kita angeben."
              getOptionLabel={(institution) =>
                institution
                  ? formatInstitutionNameWithCategoryShort(institution)
                  : ""
              }
              validate={() =>
                openChildrenInInstitution
                  ? undefined
                  : "Für diese Einrichtung sind in dem angegebenen Schuljahr keine Kinder zugeordnet. Bitte wählen Sie eine andere Einrichtung aus."
              }
            />
            <SearchGroupField
              name="groupName"
              label="Gruppe"
              schoolYear={form.values.schoolYear}
              institution={form.values.institution}
              openGroupsOnly
            />
            <SelectField
              name="type"
              label="Typ"
              options={PROPHYLAXIS_TYPE_OPTIONS_WITH_DESELECTION}
            />
            <ScreeningField />
            <FluoridationField />
            <Typography component="h3" level="title-sm">
              Durchführende Personen
            </Typography>
            <UserField
              name="dentistIds"
              options={allDentists}
              blockedStaff={[]}
              freeStaff={[]}
              label="Zahnarzt/-ärztin"
            />
            <UserField
              name="zfaIds"
              options={allDentalAssistants}
              blockedStaff={[]}
              freeStaff={[]}
              label="ZFA"
            />
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Anlegen"
            submitting={form.isSubmitting}
            onCancel={() => props.onClose(false)}
          />
        </SidebarActions>
      </SidebarForm>
    </FormikProvider>
  );
}

function calculateCurrentSchoolYear(): number {
  const currentDate = new Date();

  const middle = new Date(currentDate.getFullYear(), 7, 1);
  if (middle.getUTCDate() < currentDate.getUTCDate()) {
    return currentDate.getFullYear();
  }
  return currentDate.getFullYear() - 1;
}

function mapProphylaxisSessionFormValuesToRequest(
  values: CreateProphylaxisSessionFormValues,
): ApiCreateProphylaxisSessionRequest {
  return {
    dateAndTime: new Date(values.dateAndTime),
    institutionId: mapRequiredValue(values.institution)?.id,
    schoolYear: values.schoolYear,
    groupName: mapOptionalValue(values.groupName) ?? undefined,
    type: mapOptionalValue(values.type),
    isScreening: values.isScreening,
    dentitionType: values.isScreening
      ? mapRequiredValue(values.dentitionType)
      : undefined,
    fluoridationVarnish: values.isFluoridation
      ? mapRequiredValue(values.fluoridationVarnish)
      : undefined,
    dentistIds: values.dentistIds,
    zfaIds: values.zfaIds,
  };
}
