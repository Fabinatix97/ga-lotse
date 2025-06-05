/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Sheet, Stack, Typography } from "@mui/joy";
import { addMinutes, isBefore, isSameDay, subMinutes } from "date-fns";
import { Formik, FormikErrors, useFormikContext } from "formik";
import { PropsWithChildren } from "react";

import {
  ApiBlockingEventsOfResource,
  ApiEventWithTimeData,
  ApiResource,
  ApiResourceType,
  ApiResourceTypeFromJSON,
} from "@eshg/base-api";
import type { ApiInspectionTravelTime } from "@eshg/inspection-api";
import {
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  validateTodayOrFutureDate,
} from "@eshg/lib-employee-portal";
import {
  DateField,
  SelectField,
  formatDate,
  formatDateTime,
  formatTime,
  optionsFromRecord,
  toDateString,
} from "@eshg/lib-portal";

import { resourceTypeNames } from "@/lib/baseModule/components/resources/constants";
import { useAddResource } from "@/lib/businessModules/inspection/api/mutations/resources";
import { useGetResourcesWithEvents } from "@/lib/businessModules/inspection/api/queries/resources";
import { SelectableCardsField } from "@/lib/shared/components/formFields/SelectableCardsField";
import { TimeField } from "@/lib/shared/components/formFields/TimeField";
import {
  formatTimeInput,
  parseTime,
  toLocalDateTime,
} from "@/lib/shared/helpers/dateTime";

interface DateTimeInputs {
  date: string;
  startTime: string;
  endTime: string;
}

interface ResourceFormType extends DateTimeInputs {
  resourceType: ApiResourceType | "";
  resourceId: string;
}

interface TimeIntervalType {
  start: Date;
  end: Date;
}

interface ResourceSidebarProps {
  open: boolean;
  onClose: () => void;
  procedureId: string;
  plannedAppointment?: TimeIntervalType;
  standardBufferTime?: number;
  travelTime?: ApiInspectionTravelTime;
}

export function ResourceSidebar(props: Readonly<ResourceSidebarProps>) {
  return (
    <OverlayBoundary>
      <ResourceSidebarWithQuery {...props} />
    </OverlayBoundary>
  );
}

function ResourceSidebarWithQuery({
  open,
  onClose,
  procedureId,
  plannedAppointment,
  standardBufferTime,
  travelTime,
}: Readonly<ResourceSidebarProps>) {
  const initialValues: ResourceFormType = {
    resourceType: "",
    resourceId: "",
    ...convertStartEnd(plannedAppointment),
  };

  const { mutateAsync: addResource } = useAddResource();

  async function handleSubmit(values: ResourceFormType) {
    await addResource({
      id: procedureId,
      apiUpdateInspectionAddResourceRequest: {
        resourceId: values.resourceId,
        start: toLocalDateTime(values.date, values.startTime),
        end: toLocalDateTime(values.date, values.endTime),
      },
    });
    onClose();
  }

  function validateStartBeforeEnd(
    values: ResourceFormType,
  ): FormikErrors<ResourceFormType> | undefined {
    if (!isBefore(parseTime(values.startTime), parseTime(values.endTime))) {
      return { startTime: "Startzeit muss vor Endezeit liegen" };
    }
  }

  function isValidInput(
    values: ResourceFormType,
    errors: FormikErrors<ResourceFormType>,
  ) {
    if (!values.resourceType) return false;
    if (!values.date) return false;
    if (!values.startTime) return false;
    if (!values.endTime) return false;
    const fields = Object.keys(errors);
    return (
      fields.length === 0 || (fields.length === 1 && fields[0] === "resourceId")
    );
  }

  return (
    <Sidebar open={open} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={validateStartBeforeEnd}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, handleSubmit, touched, errors }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title="Ressource hinzufügen">
              <ResourceSelectFields
                plannedAppointment={plannedAppointment}
                standardBufferTime={standardBufferTime}
                travelTime={travelTime}
              >
                <OverlayBoundary>
                  {isValidInput(values, errors) &&
                    touched &&
                    values.resourceType !== "" && (
                      <SelectResource
                        resourceType={values.resourceType}
                        start={toLocalDateTime(values.date, values.startTime)}
                        end={toLocalDateTime(values.date, values.endTime)}
                      />
                    )}
                </OverlayBoundary>
              </ResourceSelectFields>
            </SidebarContent>

            <SidebarActions>
              <FormButtonBar
                submitLabel="Hinzufügen"
                submitting={isSubmitting}
                onCancel={onClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function ResourceSelectFields({
  plannedAppointment,
  standardBufferTime,
  travelTime,
  children,
}: PropsWithChildren<{
  plannedAppointment?: TimeIntervalType;
  standardBufferTime?: number;
  travelTime?: ApiInspectionTravelTime;
}>) {
  const { setFieldValue, touched } = useFormikContext<ResourceFormType>();

  async function handleChangeResourceType(newValue: string) {
    const resourceType = ApiResourceTypeFromJSON(newValue);
    if (!touched.startTime && !touched.endTime) {
      const startBuffer =
        resourceType === ApiResourceType.Room
          ? 0
          : (travelTime?.startBufferInMinutes ?? standardBufferTime);
      const endBuffer =
        resourceType === ApiResourceType.Room
          ? 0
          : (travelTime?.endBufferInMinutes ?? standardBufferTime);

      const result = convertStartEnd(
        plannedAppointment,
        startBuffer,
        endBuffer,
      );
      await setFieldValue("startTime", result.startTime);
      await setFieldValue("endTime", result.endTime);
    }
  }

  return (
    <Grid container columnSpacing={2} rowSpacing={3}>
      <Grid xs={12}>
        <SelectField
          name="resourceType"
          label="Ressource-Typ auswählen"
          options={optionsFromRecord(resourceTypeNames)}
          required="Bitte einen Resourcetyp auswählen."
          onChange={(newValue) => handleChangeResourceType(newValue)}
        />
      </Grid>
      <Grid xs={12}>
        <DateField
          name="date"
          label="Datum"
          required="Bitte ein Datum angeben."
          validate={validateTodayOrFutureDate}
        />
      </Grid>
      <Grid xs={6}>
        <TimeField
          name="startTime"
          label="Startzeit"
          required="Bitte eine Startzeit angeben."
        />
      </Grid>
      <Grid xs={6}>
        <TimeField
          name="endTime"
          label="Endzeit"
          required="Bitte eine Endzeit angeben."
        />
      </Grid>
      {children}
    </Grid>
  );
}

function SelectResource({
  resourceType,
  start,
  end,
}: Readonly<{
  resourceType: ApiResourceType;
  start: Date;
  end: Date;
}>) {
  const {
    data: { resources, calendarResponse },
  } = useGetResourcesWithEvents({
    resourceType,
    start,
    end,
  });

  const { freeResources, bookedResources } = computeFreeAndBookedResources(
    resources,
    calendarResponse.resourcesWithBlockingEvents,
  );

  const selectOptions = freeResources.map((resource) => ({
    value: resource.id,
    content: <Typography>{resource.name}</Typography>,
  }));

  return (
    <>
      <Grid xs={12}>
        <SelectableCardsField
          name="resourceId"
          label="Im Zeitraum freie Ressourcen"
          required="Bitte eine Ressource auswählen."
          options={selectOptions}
        />
        {selectOptions.length === 0 && (
          <Typography color="danger">
            Keine freien Ressourcen verfügbar. Bitte wählen Sie einen anderen
            Zeitraum.
          </Typography>
        )}
      </Grid>
      {bookedResources.length > 0 && (
        <Grid xs={12}>
          <BookedResources bookedResources={bookedResources} />
        </Grid>
      )}
    </>
  );
}

function BookedResources({
  bookedResources,
}: Readonly<{
  bookedResources: {
    resource: ApiResource;
    events: ApiEventWithTimeData[];
  }[];
}>) {
  return (
    <Stack>
      <Typography level="body-sm" fontWeight="500">
        Im Zeitraum nicht verfügbare Ressourcen:
      </Typography>
      {bookedResources.map((it) => (
        <BookedResource key={it.resource.id} bookedResource={it} />
      ))}
    </Stack>
  );
}

function BookedResource({
  bookedResource,
}: Readonly<{
  bookedResource: {
    resource: ApiResource;
    events: ApiEventWithTimeData[];
  };
}>) {
  return (
    <Sheet variant="outlined" sx={{ mt: 1 }}>
      <Stack>
        <Typography>{bookedResource.resource.name}</Typography>
        {bookedResource.events.map((it) => (
          <Typography key={it.id} level="body-sm" color="neutral">
            {getEventText(it)}
          </Typography>
        ))}
      </Stack>
    </Sheet>
  );
}

function getEventText(event: ApiEventWithTimeData): string {
  if (event.timeData.wholeDay)
    return `gebucht am ${formatDate(event.timeData.start)}, ganztägig`;
  else if (isSameDay(event.timeData.start, event.timeData.end))
    return `gebucht am ${formatDate(event.timeData.start)} von ${formatTime(event.timeData.start)} bis ${formatTime(event.timeData.end)}`;
  else
    return `gebucht von ${formatDateTime(event.timeData.start)} bis ${formatDateTime(event.timeData.end)}`;
}

function convertStartEnd(
  interval?: TimeIntervalType,
  startBuffer?: number,
  endBuffer?: number,
): DateTimeInputs {
  return {
    date: interval ? toDateString(interval.start) : "",
    startTime: interval
      ? formatTimeInput(substractBufferTime(interval.start, startBuffer))
      : "",
    endTime: interval
      ? formatTimeInput(addBufferTime(interval.end, endBuffer))
      : "",
  };
}

function addBufferTime(date: Date, bufferTime?: number): Date {
  return bufferTime ? addMinutes(date, bufferTime) : date;
}

function substractBufferTime(date: Date, bufferTime?: number): Date {
  return bufferTime ? subMinutes(date, bufferTime) : date;
}

function computeFreeAndBookedResources(
  resources: ApiResource[],
  resourcesWithBlockingEvents: ApiBlockingEventsOfResource[],
) {
  const idToResourceMap = new Map<string, ApiResource>(
    resources.map((resource) => [resource.id, resource]),
  );

  // free resources have an empty list of events
  const freeResources = resourcesWithBlockingEvents
    .filter((resource) => resource.events.length === 0)
    .filter((resource) => idToResourceMap.has(resource.resourceId))
    .map((resource) => idToResourceMap.get(resource.resourceId)!)
    .sort((a, b) => a.name.localeCompare(b.name));

  const bookedResources = resourcesWithBlockingEvents
    .filter((resource) => resource.events.length > 0)
    .filter((resource) => idToResourceMap.has(resource.resourceId))
    .map((resource) => ({
      resource: idToResourceMap.get(resource.resourceId)!,
      events: resource.events,
    }))
    .sort((a, b) => a.resource.name.localeCompare(b.resource.name));

  return { freeResources, bookedResources };
}
