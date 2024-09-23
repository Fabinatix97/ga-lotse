/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddContact200Response,
  ApiContactCategory,
} from "@eshg/employee-portal-api/base";
import {
  ApiAppointment,
  ApiLocationSelectionMode,
  ApiSchoolEntryProcedureType,
  UpdateProcedureRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { Alert, AlertProps } from "@eshg/lib-portal/components/Alert";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  SelectObjectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { validatePastOrTodayDate } from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { ReactNode, useRef, useState } from "react";
import { isDefined, isNullish } from "remeda";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { School } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import {
  Location,
  ProcedureDetails,
} from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useUpdateProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { useGetFreeAppointmentsForProcedureUnsuspended } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import {
  PROCEDURE_TYPE_OPTIONS_ENTRY_LEVEL,
  PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { LabelSelection } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/LabelSelection";
import { isDraft } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/options";
import { SchoolYearField } from "@/lib/businessModules/schoolEntry/features/procedures/shared/schoolYear";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

import { SelectContactField } from "./SelectContactField";

export interface ModifyProcedureValues {
  procedureType: ApiSchoolEntryProcedureType;
  labels: Label[];
  appointment: SelectObjectFieldValue<ApiAppointment, false>;
  isInvitationSent: boolean;
  school: School;
  location: Location;
  isDeceased: boolean;
  deceased: OptionalFieldValue<string>;
  schoolYear: OptionalFieldValue<number>;
}

interface UpdateProcedureSidebarProps {
  procedure: ProcedureDetails;
  canEditSchoolYear: boolean;
  onClose: () => void;
  locationSelectionMode: ApiLocationSelectionMode;
}

function getId(label: Label) {
  return label.id;
}

function mapValues(
  values: ModifyProcedureValues,
  procedure: ProcedureDetails,
): UpdateProcedureRequest {
  return {
    procedureId: procedure.id,
    apiUpdateProcedureRequest: {
      version: procedure.version,
      labels: values.labels.map(getId),
      procedureType:
        isDraft(procedure.type) && isEmptyString(values.procedureType)
          ? procedure.type
          : values.procedureType,
      appointment: values.appointment ?? undefined,
      isInvitationSent: values.isInvitationSent,
      schoolId: values.school?.id ?? null,
      locationId: values.location?.id ?? null,
      isDeceased: values.isDeceased,
      deceased: isEmptyString(values.deceased)
        ? undefined
        : toUtcDate(values.deceased),
      schoolYear: mapOptionalValue(values.schoolYear),
    },
  };
}

function getAppointmentLabel(appointment: Appointment) {
  return `${formatDateTime(appointment.start)} - ${formatDateTime(
    appointment.end,
  )}`;
}

export function UpdateProcedureSidebar(props: UpdateProcedureSidebarProps) {
  const procedure = props.procedure;

  const isInitialEntryLevel =
    procedure.isEntryLevel &&
    procedure.type === ApiSchoolEntryProcedureType.DraftSchoolImport;

  const isMissingChildAddress = !isDefined(procedure.child.contactAddress);

  const initialValues: ModifyProcedureValues = {
    procedureType: procedure.type,
    labels: procedure.labels,
    appointment: procedure.appointment ?? null,
    isInvitationSent: procedure.isInvitationSent,
    school: procedure.school,
    location: procedure.location,
    isDeceased: procedure.isDeceased,
    deceased: isDefined(procedure.deceased)
      ? toDateString(procedure.deceased)
      : "",
    schoolYear: parseOptionalValue(procedure.schoolYear),
  };
  const hasInitialAppointment = initialValues.appointment !== null;

  const modifyProcedure = useUpdateProcedure();

  async function handleSubmit(values: ModifyProcedureValues) {
    await modifyProcedure
      .mutateAsync(mapValues(values, procedure), {
        onSuccess: props.onClose,
      })
      .catch();
  }

  const [type, setType] = useState(procedure.type);
  const [labelIds, setLabelIds] = useState(procedure.labels.map(getId));
  const [locationId, setLocationId] = useState<string | undefined>(
    procedure.location.id,
  );

  function handleChangeLabels(newValue: Label[]) {
    setLabelIds(newValue.map(getId));
  }

  function handleLocationChanged(
    locationSelectionMode: ApiLocationSelectionMode,
    setFieldValue: (
      field: string,
      value: null,
    ) => Promise<void | FormikErrors<ModifyProcedureValues>>,
  ) {
    return function handleChanged(
      contact: SelectObjectFieldValue<ApiAddContact200Response, false>,
    ) {
      if (props.locationSelectionMode === locationSelectionMode) {
        setLocationId(contact?.id);
        void setFieldValue("appointment", null);
      }
    };
  }

  const getFreeAppointments = useGetFreeAppointmentsForProcedureUnsuspended({
    procedureId: procedure.id,
    procedureType: type,
    labelIds,
    locationId,
  });
  const freeAppointments = getFreeAppointments.data ?? [];
  const hasNoFreeAppointments = freeAppointments.length === 0;

  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  return (
    <Sidebar open onClose={props.onClose}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, isSubmitting, setFieldValue }) => (
          <SidebarForm ref={sidebarFormRef}>
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
                  onChange={(value) =>
                    setType(value as ApiSchoolEntryProcedureType)
                  }
                />
                {props.canEditSchoolYear && (
                  <SchoolYearField name="schoolYear" label="Schuljahr" />
                )}
                <LabelSelection onChange={handleChangeLabels} />
                <Divider />
                <SelectContactField
                  name="school"
                  label="Schule"
                  category={ApiContactCategory.School}
                  onChange={handleLocationChanged(
                    ApiLocationSelectionMode.School,
                    setFieldValue,
                  )}
                />
                {props.locationSelectionMode ===
                  ApiLocationSelectionMode.HealthDepartment && (
                  <SelectContactField
                    name="location"
                    label="Gesundheitsamt"
                    category={ApiContactCategory.HealthDepartment}
                    onChange={handleLocationChanged(
                      ApiLocationSelectionMode.HealthDepartment,
                      setFieldValue,
                    )}
                  />
                )}
                <Divider />
                <SelectObjectField
                  name="appointment"
                  label="Termin"
                  required={
                    hasInitialAppointment
                      ? "Termin darf nicht gelöscht werden."
                      : undefined
                  }
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
                    setFieldValue("isInvitationSent", false)
                  }
                />
                {displayWarningWhen(isMissingChildAddress, {
                  title: "Adresse fehlt",
                  message:
                    "Erfassen Sie die Adresse des Kindes, um einen Termin zuweisen und eine Einladung versenden zu können.",
                })}
                {displayWarningWhen(
                  props.locationSelectionMode ===
                    ApiLocationSelectionMode.School &&
                    isContactEmpty(values.school),
                  {
                    title: "Schule fehlt",
                    message:
                      "Erfassen Sie die Schule, um einen Termin zuweisen und eine Einladung versenden zu können.",
                  },
                )}
                {displayWarningWhen(
                  props.locationSelectionMode ===
                    ApiLocationSelectionMode.HealthDepartment &&
                    isContactEmpty(values.location),
                  {
                    title: "Gesundheitsamt fehlt",
                    message:
                      "Erfassen Sie das Gesundheitsamt, um einen Termin zuweisen und eine Einladung versenden zu können.",
                  },
                )}
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
        )}
      </Formik>
    </Sidebar>
  );
}

function displayWarningWhen(
  condition: boolean,
  props: Omit<AlertProps, "color">,
): ReactNode {
  return condition && <Alert {...props} color="warning" />;
}

function isContactEmpty(school: School): boolean {
  return isNullish(school) || school.id === "";
}
