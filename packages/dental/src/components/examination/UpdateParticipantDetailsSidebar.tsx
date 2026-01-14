/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { ApiBooleanWithUnknown, ApiGender } from "@eshg/dental-api";
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
  Alert,
  BooleanSelectField,
  DateField,
  GENDER_OPTIONS,
  InputField,
  SelectField,
  isEmptyString,
  isNonEmptyString,
  toDateString,
  toUtcDate,
  useValidatePastOrTodayDate,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { Institution } from "../../api/models/Institution";
import { childApiQueryKey } from "../../config/apiQueryKeys";
import { FLUORIDATION_CONSENTED_OPTIONS } from "../../config/child";
import { useDentalApi } from "../../contexts/dental";
import { getChildDetailsQuery } from "../../features/children/api/queries/details";
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
  dateOfExamination: Date;
}

function UpdateParticipantDetailsSidebar(
  props: UpdateParticipantDetailsSidebarProps,
) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const { childApi, procedureLabelApi } = useDentalApi();
  const { participantDetails, onClose } = props;

  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, participantDetails.id),
  );
  const fileStateUpdatePending = child.personDetails.outdated;

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
      {({ values, isSubmitting, setFieldValue }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Details zum Kind">
            <Stack gap={3}>
              {fileStateUpdatePending && (
                <Alert
                  message="Personenangaben wurden geändert"
                  color="warning"
                />
              )}
              <InputField
                name="firstName"
                label="Vorname"
                disabled={fileStateUpdatePending}
                required="Bitte einen Vornamen angeben."
              />
              <InputField
                name="lastName"
                label="Nachname"
                disabled={fileStateUpdatePending}
                required="Bitte einen Nachnamen angeben."
              />
              <DateField
                name="dateOfBirth"
                label="Geburtsdatum"
                required="Bitte ein Geburtsdatum angeben."
                disabled={fileStateUpdatePending}
                validate={validateDateOfBirth}
              />
              <SelectField
                name="gender"
                label="Geschlecht"
                disabled={fileStateUpdatePending}
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
              <SelectField
                name="fluoridationConsent.consented"
                label="Einverständnis"
                options={FLUORIDATION_CONSENTED_OPTIONS}
                required={
                  isDefined(values.fluoridationConsent?.dateOfConsent) &&
                  !isEmptyString(values.fluoridationConsent.dateOfConsent)
                    ? "Bitte Einverständnis auswählen."
                    : undefined
                }
                onChange={(value) => {
                  if (value === ApiBooleanWithUnknown.Unknown) {
                    void setFieldValue(
                      "fluoridationConsent.dateOfConsent",
                      toDateString(new Date()),
                    );
                    void setFieldValue("fluoridationConsent.hasAllergy", "");
                  }
                  if (isEmptyString(value)) {
                    void setFieldValue("fluoridationConsent.dateOfConsent", "");
                    void setFieldValue("fluoridationConsent.hasAllergy", "");
                  }
                }}
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
                disabled={
                  values.fluoridationConsent?.consented ===
                  ApiBooleanWithUnknown.Unknown
                }
              />
              {isNonEmptyString(values.fluoridationConsent?.dateOfConsent) &&
                props.dateOfExamination <
                  new Date(values.fluoridationConsent.dateOfConsent) && (
                  <Alert
                    color="warning"
                    message="Das Datum liegt nach dem Datum der Maßnahme und die Einverständnis ist nicht relevant für die Durchführung der Fluoridierung."
                  />
                )}
              {(values.fluoridationConsent?.consented ===
                ApiBooleanWithUnknown.True ||
                values.fluoridationConsent?.consented ===
                  ApiBooleanWithUnknown.False) && (
                <BooleanSelectField
                  name="fluoridationConsent.hasAllergy"
                  label="Allergie"
                  allowDeselection
                  validate={(value) =>
                    validateAllergy(value, values.fluoridationConsent)
                  }
                />
              )}
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
