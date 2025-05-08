/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
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
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { Alert, AlertProps } from "@eshg/lib-portal/components/Alert";
import { CheckboxField } from "@eshg/lib-portal/components/formFields/CheckboxField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  SelectObjectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { formatWeekdayDateTimeRange } from "@eshg/lib-portal/formatters/dateTime";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { useValidatePastOrTodayDate } from "@eshg/lib-portal/hooks/useValidators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiAppointment,
  ApiLocationSelectionMode,
  ApiSchoolEntryProcedureType,
  UpdateProcedureRequest,
} from "@eshg/school-entry-api";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { Location } from "@/lib/businessModules/schoolEntry/api/models/Location";
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

interface UpdateProcedureValues {
  procedureType: ApiSchoolEntryProcedureType;
  procedureLabels: ProcedureLabel[];
  appointment: SelectObjectFieldValue<ApiAppointment, false>;
  isInvitationSent: boolean;
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

function getId(label: ProcedureLabel) {
  return label.id;
}

function mapValues(
  values: UpdateProcedureValues,
  procedure: ProcedureDetails,
): UpdateProcedureRequest {
  return {
    procedureId: procedure.id,
    apiUpdateProcedureRequest: {
      version: procedure.version,
      procedureLabels: values.procedureLabels.map(getId),
      procedureType:
        isDraft(procedure.type) && isEmptyString(values.procedureType)
          ? procedure.type
          : values.procedureType,
      appointment: values.appointment ?? undefined,
      isInvitationSent: values.isInvitationSent,
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

function getAppointmentLabel(appointment: Appointment) {
  return formatWeekdayDateTimeRange(appointment.start, appointment.end);
}

function useUpdateProcedureForm(
  procedure: ProcedureDetails,
  onSuccess: () => void,
) {
  const updateProcedure = useUpdateProcedure(procedure.id);
  return useFormik<UpdateProcedureValues>({
    initialValues: {
      procedureType: procedure.type,
      procedureLabels: procedure.labels,
      appointment: procedure.appointment ?? null,
      isInvitationSent: procedure.isInvitationSent,
      school: procedure.school ?? null,
      location: procedure.location ?? null,
      isDeceased: procedure.isDeceased,
      deceased: isDefined(procedure.deceased)
        ? toDateString(procedure.deceased)
        : "",
      schoolYear: parseOptionalValue(procedure.schoolYear),
      hasBeenClosed: procedure.hasBeenClosed,
    },
    onSubmit: (values) =>
      updateProcedure.mutateAsync(mapValues(values, procedure), {
        onSuccess,
      }),
  });
}

function UpdateProcedureSidebar(props: UpdateProcedureSidebarProps) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const labelApi = useLabelApi();
  const { procedure, locationSelectionMode } = props;

  const isInitialEntryLevel =
    procedure.isEntryLevel &&
    procedure.type === ApiSchoolEntryProcedureType.DraftSchoolImport;

  const isMissingChildAddress = !isDefined(procedure.child.contactAddress);

  const form = useUpdateProcedureForm(procedure, () => props.onClose(true));
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
              onValueChanged={() =>
                void setFieldValue("isInvitationSent", false)
              }
            />
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
              <DateField
                name="deceased"
                label="am"
                component={HorizontalField}
                validate={validatePastOrTodayDate}
              />
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

  return labels.map(getId);
}
