/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { ApiGender } from "@eshg/dental-api";
import {
  FormButtonBar,
  ProcedureLabel,
  ProcedureLabelSelection,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  BooleanSelectField,
  DateField,
  GENDER_OPTIONS,
  InputField,
  SelectField,
  isEmptyString,
  toDateString,
  toUtcDate,
  useValidatePastOrTodayDate,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { Institution } from "../../api/models/Institution";
import { childApiQueryKey } from "../../config/apiQueryKeys";
import { useDentalApi } from "../../contexts/dental";
import { ParticipantDetails } from "../../features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";
import {
  FluoridationConsent,
  mapFluoridationConsentToFormValues,
  mapFluoridationConsentToRequest,
} from "../../utils/childDetails/FluoridationConsent";
import { validateAllergy } from "../../utils/childDetails/validateAllergy";
import { SearchGroupField } from "../group/SearchGroupField";

export function useUpdateParticipantDetailsSidebar(): UseSidebarWithFormRefResult<UpdateParticipantDetailsSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateParticipantDetailsSidebar,
  });
}

interface UpdateParticipantDetailsValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: ApiGender;
  groupName?: string;
  procedureLabels: ProcedureLabel[];
  fluoridationConsent?: FluoridationConsent;
}

interface UpdateParticipantDetailsSidebarProps extends SidebarWithFormRefProps {
  institution?: Institution;
  participantDetails: ParticipantDetails;
  setParticipantDetails: (participantDetails: ParticipantDetails) => void;
}

function UpdateParticipantDetailsSidebar(
  props: UpdateParticipantDetailsSidebarProps,
) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const { procedureLabelApi } = useDentalApi();
  const { participantDetails, onClose } = props;

  const INITIAL_VALUES = {
    firstName: participantDetails.firstName,
    lastName: participantDetails.lastName,
    dateOfBirth: toDateString(participantDetails.dateOfBirth),
    gender: participantDetails.gender,
    groupName: participantDetails.groupName,
    fluoridationConsent: mapFluoridationConsentToFormValues(
      participantDetails.currentFluoridationConsent,
    ),
    procedureLabels: participantDetails.procedureLabels,
  };

  function handleSubmit(values: UpdateParticipantDetailsValues) {
    props.setParticipantDetails(
      mapParticipantDetailsValues(
        props.participantDetails.id,
        props.participantDetails.version,
        values,
      ),
    );
    onClose(true);
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Details zum Kind">
            <Stack gap={3}>
              <InputField
                name="firstName"
                label="Vorname"
                required="Bitte einen Vornamen angeben."
              />
              <InputField
                name="lastName"
                label="Nachname"
                required="Bitte einen Nachnamen angeben."
              />
              <DateField
                name="dateOfBirth"
                label="Geburtsdatum"
                required="Bitte ein Geburtsdatum angeben."
                validate={validateDateOfBirth}
              />
              <SelectField
                name="gender"
                label="Geschlecht"
                options={GENDER_OPTIONS}
              />
              <SearchGroupField
                name="groupName"
                label="Gruppe"
                institution={props.institution ?? null}
                freeSolo
              />
              <ProcedureLabelSelection
                procedureLabelApi={procedureLabelApi}
                procedureLabelApiQueryKey={childApiQueryKey}
              />
              <Typography>Fluoridierung</Typography>
              <BooleanSelectField
                name="fluoridationConsent.consented"
                label="Einverständnis"
                required={
                  isDefined(values.fluoridationConsent?.dateOfConsent) &&
                  !isEmptyString(values.fluoridationConsent.dateOfConsent)
                    ? 'Bitte "Ja" oder "Nein" auswählen.'
                    : undefined
                }
                allowDeselection
              />
              <DateField
                name="fluoridationConsent.dateOfConsent"
                label="Datum"
                validate={(value) =>
                  isDefined(value) ? validatePastOrTodayDate(value) : undefined
                }
                required={
                  isDefined(values.fluoridationConsent?.consented) &&
                  !isEmptyString(values.fluoridationConsent.consented)
                    ? "Bitte das Datum der Einverständniserklärung angeben."
                    : undefined
                }
              />
              <BooleanSelectField
                name="fluoridationConsent.hasAllergy"
                label="Allergie"
                allowDeselection
                validate={(value) =>
                  validateAllergy(value, values.fluoridationConsent)
                }
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() => onClose()}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function mapParticipantDetailsValues(
  childId: string,
  version: number,
  values: UpdateParticipantDetailsValues,
): ParticipantDetails {
  return {
    id: childId,
    version,
    firstName: values.firstName,
    lastName: values.lastName,
    dateOfBirth: toUtcDate(values.dateOfBirth),
    gender: values.gender,
    groupName: values.groupName,
    currentFluoridationConsent: mapFluoridationConsentToRequest(
      values.fluoridationConsent,
    ),
    procedureLabels: values.procedureLabels,
  };
}
