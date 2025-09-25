/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Divider, Radio, Stack } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { ReactNode, useEffect } from "react";
import { isDefined } from "remeda";

import { ApiContactCategory } from "@eshg/base-api";
import {
  FormButtonBar,
  ProcedureLabel,
  ProcedureLabelSelection,
  SchoolYearField,
  SelectContactField,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  TimeField,
  UseSidebarWithFormRefResult,
  getEntityId,
  parseTime,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  Alert,
  AlertProps,
  CheckboxField,
  DateField,
  HorizontalField,
  OptionalFieldValue,
  RadioGroupField,
  SelectField,
  SelectObjectField,
  SelectObjectFieldValue,
  formatTime,
  formatWeekdayDateTimeRange,
  isEmptyString,
  mapOptionalValue,
  parseOptionalValue,
  toDateString,
  toUtcDate,
  useHasChanged,
  useValidatePastOrTodayDate,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiLocationSelectionMode,
  ApiSchoolEntryProcedureType,
  UpdateProcedureRequest,
} from "@eshg/school-entry-api";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { Location } from "@/lib/businessModules/schoolEntry/api/models/Location";
import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useUpdateProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { useGetFreeAppointmentsForProcedureUnsuspended } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import {
  PROCEDURE_TYPE_OPTIONS_ENTRY_LEVEL,
  PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { isDraft } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/options";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";

export function useUpdateProcedureSidebar(): UseSidebarWithFormRefResult<UpdateProcedureSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateProcedureSidebar,
  });
}

const AppointmentSelectionType = {
  Block: "block",
  AdHoc: "adhoc",
} as const;

type AppointmentSelectionType =
  (typeof AppointmentSelectionType)[keyof typeof AppointmentSelectionType];

interface UpdateProcedureValues {
  procedureType: ApiSchoolEntryProcedureType;
  procedureLabels: ProcedureLabel[];
  appointment: SelectObjectFieldValue<ApiAppointment, false>;
  appointmentSelectionType: AppointmentSelectionType;
  adHocTime: string;
  isInvitationSent: boolean;
  changeRecipient: boolean;
  recipient: PersonDetails | null;
  school: Location | null;
  location: Location | null;
  isDeceased: boolean;
  deceased: OptionalFieldValue<string>;
  schoolYear: OptionalFieldValue<number>;
  hasBeenClosed: boolean;
}

interface UpdateProcedureSidebarProps extends SidebarWithFormRefProps {
  procedure: ProcedureDetails;
  locationSelectionMode: ApiLocationSelectionMode;
}

function mapValues(
  values: UpdateProcedureValues,
  procedure: ProcedureDetails,
  locationSelectionMode: ApiLocationSelectionMode,
): UpdateProcedureRequest {
  return {
    procedureId: procedure.id,
    apiUpdateProcedureRequest: {
      version: procedure.version,
      procedureLabels: values.procedureLabels.map(getEntityId),
      procedureType:
        isDraft(procedure.type) && isEmptyString(values.procedureType)
          ? procedure.type
          : values.procedureType,
      ...mapValuesToAppointment(values, procedure, locationSelectionMode),
      isInvitationSent: values.isInvitationSent,
      custodianId: values.recipient?.fileStateId,
      schoolId: values.school?.id ?? undefined,
      locationId: values.location?.id ?? undefined,
      isDeceased: values.isDeceased,
      deceased: isEmptyString(values.deceased)
        ? undefined
        : toUtcDate(values.deceased),
      schoolYear: mapOptionalValue(values.schoolYear),
    },
  };
}

function mapValuesToAppointment(
  values: UpdateProcedureValues,
  procedure: ProcedureDetails,
  locationSelectionMode: ApiLocationSelectionMode,
) {
  if (values.appointmentSelectionType === AppointmentSelectionType.Block) {
    return { appointment: values.appointment ?? undefined };
  } else {
    if (
      !isDefined(procedure.child.contactAddress) ||
      isAdHocAppointmentForbidden(values, locationSelectionMode)
    ) {
      return {};
    }
    const date = parseTime(values.adHocTime);
    return {
      appointment: { start: date, end: date },
      createAdHocAppointment: true,
    };
  }
}

function getAppointmentLabel(appointment: Appointment) {
  return formatWeekdayDateTimeRange(appointment.start, appointment.end);
}

function getPersonDetailsLabel(personDetails: PersonDetails) {
  return `${personDetails.firstName} ${personDetails.lastName}`;
}

function useUpdateProcedureForm(
  procedure: ProcedureDetails,
  locationSelectionMode: ApiLocationSelectionMode,
  onSuccess: () => void,
) {
  const updateProcedure = useUpdateProcedure(procedure.id);
  return useFormik<UpdateProcedureValues>({
    initialValues: {
      procedureType: procedure.type,
      procedureLabels: procedure.labels,
      appointment: procedure.appointment ?? null,
      adHocTime: formatTime(
        new Date(Math.round(Date.now() / 300_000) * 300_000),
      ),
      isInvitationSent: procedure.isInvitationSent,
      changeRecipient: false,
      recipient: null,
      school: procedure.school ?? null,
      location: procedure.location ?? null,
      isDeceased: procedure.isDeceased,
      appointmentSelectionType: AppointmentSelectionType.Block,
      deceased: isDefined(procedure.deceased)
        ? toDateString(procedure.deceased)
        : "",
      schoolYear: parseOptionalValue(procedure.schoolYear),
      hasBeenClosed: procedure.hasBeenClosed,
    },
    onSubmit: (values) =>
      updateProcedure.mutateAsync(
        mapValues(values, procedure, locationSelectionMode),
        {
          onSuccess,
        },
      ),
  });
}

function isAdHocAppointmentForbidden(
  values: UpdateProcedureValues,
  locationSelectionMode: ApiLocationSelectionMode,
) {
  return (
    !values.procedureType ||
    isDraft(values.procedureType) ||
    (isSchoolSelectionMode(locationSelectionMode) && values.school === null) ||
    (isHealthDepartmentSelectionMode(locationSelectionMode) &&
      values.location === null)
  );
}

function UpdateProcedureSidebar(props: UpdateProcedureSidebarProps) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const labelApi = useLabelApi();
  const { procedure, locationSelectionMode } = props;

  const isInitialEntryLevel =
    procedure.isEntryLevel &&
    procedure.type === ApiSchoolEntryProcedureType.DraftSchoolImport;

  const isMissingChildAddress = !isDefined(procedure.child.contactAddress);

  const form = useUpdateProcedureForm(procedure, locationSelectionMode, () =>
    props.onClose(true),
  );
  const { values, isSubmitting, setFieldValue } = form;

  const getFreeAppointments = useGetFreeAppointmentsForProcedureUnsuspended({
    procedureId: procedure.id,
    procedureType: values.procedureType,
    labelIds: resolveLabelIds(values.procedureLabels),
    schoolId: values.school?.id,
    locationId: values.location?.id,
  });
  const freeAppointments = getFreeAppointments.data ?? [];
  const hasNoFreeAppointments = freeAppointments.length === 0;

  const filteredRecipients = procedure.custodians.filter(
    (person) => person.contactAddress !== undefined,
  );

  // clear appointment when school or location changes
  const schoolChanged = useHasChanged(values.school);
  const locationChanged = useHasChanged(values.location);
  const clearAppointment =
    (isSchoolSelectionMode(locationSelectionMode) && schoolChanged) ||
    (isHealthDepartmentSelectionMode(locationSelectionMode) && locationChanged);
  useEffect(() => {
    if (clearAppointment) {
      void setFieldValue("appointment", null);
    }
  }, [clearAppointment, setFieldValue]);

  function resetIsInvitationSent() {
    void setFieldValue("isInvitationSent", false);
  }

  return (
    <FormikProvider value={form}>
      <SidebarForm ref={props.formRef}>
        <SidebarContent title="Zusatzinfos">
          <Stack gap={2}>
            <SelectField
              label="Art"
              name="procedureType"
              options={
                isInitialEntryLevel
                  ? PROCEDURE_TYPE_OPTIONS_ENTRY_LEVEL
                  : PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT
              }
            />
            <SchoolYearField name="schoolYear" label="Schuljahr" />
            <ProcedureLabelSelection
              procedureLabelApi={labelApi}
              procedureLabelApiQueryKey={schoolEntryApiQueryKey}
            />
            <Divider />
            <SelectContactField
              name="school"
              label="Schule"
              placeholder="Schule suchen"
              categories={new Set([ApiContactCategory.School])}
            />
            {isHealthDepartmentSelectionMode(locationSelectionMode) && (
              <SelectContactField
                name="location"
                label="Gesundheitsamt"
                placeholder="Gesundheitsamt suchen"
                categories={new Set([ApiContactCategory.HealthDepartment])}
              />
            )}
            <Divider />
            <RadioGroupField
              name="appointmentSelectionType"
              orientation="vertical"
            >
              <Radio
                value={AppointmentSelectionType.Block}
                label="Termin planen"
              />
              {values.appointmentSelectionType ===
                AppointmentSelectionType.Block && (
                <Box marginLeft={4} marginTop={1}>
                  <SelectObjectField
                    name="appointment"
                    label="Termin"
                    options={freeAppointments}
                    getOptionLabel={getAppointmentLabel}
                    loading={getFreeAppointments.isFetching}
                    disabled={hasNoFreeAppointments || isMissingChildAddress}
                    placeholder={
                      hasNoFreeAppointments
                        ? "Keine freien Termine verfügbar."
                        : undefined
                    }
                    onValueChanged={resetIsInvitationSent}
                  />
                </Box>
              )}
              <Radio
                value={AppointmentSelectionType.AdHoc}
                label="Termin zu sofort buchen"
              />
              {values.appointmentSelectionType ===
                AppointmentSelectionType.AdHoc && (
                <Box marginLeft={4} marginTop={1}>
                  <TimeField
                    name="adHocTime"
                    disabled={
                      isMissingChildAddress ||
                      isAdHocAppointmentForbidden(values, locationSelectionMode)
                    }
                    label="Heute um"
                    onChange={resetIsInvitationSent}
                  />
                </Box>
              )}
            </RadioGroupField>
            {(values.appointment !== null ||
              values.appointmentSelectionType ===
                AppointmentSelectionType.AdHoc) &&
              filteredRecipients.length > 0 && (
                <>
                  <Alert
                    message="Der Einladungsbrief wird standardmäßig an die Adresse des Kindes adressiert."
                    color="primary"
                  />
                  <CheckboxField
                    name="changeRecipient"
                    label="Abweichender Einladungsadressat"
                    onChange={(event) => {
                      if (!event.target.checked) {
                        void setFieldValue("recipient", null);
                      }
                    }}
                  />
                  {values.changeRecipient && (
                    <Box marginLeft={4}>
                      <SelectObjectField
                        name="recipient"
                        label="Abweichender Einladungsadressat"
                        options={filteredRecipients}
                        getOptionLabel={getPersonDetailsLabel}
                        onValueChanged={resetIsInvitationSent}
                      />
                    </Box>
                  )}
                </>
              )}
            {displayWarningWhen(isMissingChildAddress, {
              title: "Adresse fehlt",
              message:
                "Erfassen Sie die Adresse des Kindes, um einen Termin zuweisen und eine Einladung versenden zu können.",
            })}
            {displayWarningWhen(
              isSchoolSelectionMode(locationSelectionMode) &&
                values.school === null,
              {
                title: "Schule fehlt",
                message:
                  "Erfassen Sie die Schule, um einen Termin zuweisen und eine Einladung versenden zu können.",
              },
            )}
            {displayWarningWhen(
              isHealthDepartmentSelectionMode(locationSelectionMode) &&
                values.location === null,
              {
                title: "Gesundheitsamt fehlt",
                message:
                  "Erfassen Sie das Gesundheitsamt, um einen Termin zuweisen und eine Einladung versenden zu können.",
              },
            )}
            {displayWarningWhen(values.hasBeenClosed, {
              title: "Keine Terminauswahl möglich",
              message:
                "Ein neuer Termin kann nicht ausgewählt werden, weil der Vorgang bereits abgeschlossen wurde.",
            })}
            {values.appointment !== null && (
              <CheckboxField
                name="isInvitationSent"
                label="Einladung versandt"
              />
            )}
            <Divider />
            <CheckboxField
              name="isDeceased"
              label="Kind verstorben"
              onChange={(event) => {
                if (!event.target.checked) {
                  void setFieldValue("deceased", "");
                }
              }}
            />
            {values.isDeceased && (
              <Box marginLeft={4}>
                <DateField
                  name="deceased"
                  label="am"
                  component={HorizontalField}
                  validate={validatePastOrTodayDate}
                />
              </Box>
            )}
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitting={isSubmitting}
            submitLabel="Speichern"
            onCancel={props.onClose}
          />
        </SidebarActions>
      </SidebarForm>
    </FormikProvider>
  );
}

function isSchoolSelectionMode(
  locationSelectionMode: ApiLocationSelectionMode,
): boolean {
  return locationSelectionMode === ApiLocationSelectionMode.School;
}

function isHealthDepartmentSelectionMode(
  locationSelectionMode: ApiLocationSelectionMode,
): boolean {
  return locationSelectionMode === ApiLocationSelectionMode.HealthDepartment;
}

function displayWarningWhen(
  condition: boolean,
  props: Omit<AlertProps, "color">,
): ReactNode {
  return condition && <Alert {...props} color="warning" />;
}

function resolveLabelIds(labels: ProcedureLabel[]): string[] | undefined {
  if (labels.length === 0) {
    return undefined;
  }

  return labels.map(getEntityId);
}
