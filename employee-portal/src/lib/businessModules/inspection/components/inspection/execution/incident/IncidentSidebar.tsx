/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { Formik } from "formik";
import { isEmpty, isNonNullish, isNullish } from "remeda";
import { v4 as uuidv4 } from "uuid";

import {
  ApiCreateInspectionIncidentRequest,
  ApiInspectionIncident,
} from "@eshg/inspection-api";
import {
  DetailsItem,
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";

import {
  useCreateIncident,
  useUpdateIncident,
} from "@/lib/businessModules/inspection/api/mutations/incidents";

interface IncidentSidebarProps {
  open: boolean;
  onClose: () => void;
  procedureId: string;
  incident?: ApiInspectionIncident;
}

type IncidentFormType = Omit<ApiCreateInspectionIncidentRequest, "externalId">;

export function IncidentSidebar(props: Readonly<IncidentSidebarProps>) {
  return (
    <OverlayBoundary>
      <IncidentSidebarInner {...props} />
    </OverlayBoundary>
  );
}

function IncidentSidebarInner({
  open,
  onClose,
  procedureId,
  incident,
}: Readonly<IncidentSidebarProps>) {
  const initialValues: IncidentFormType = isNonNullish(incident)
    ? { title: incident.title, description: incident.description }
    : { title: "", description: "" };
  const isChecklistIncident = incident?.checklistNumber !== undefined;

  const { mutateAsync: createIncident } = useCreateIncident();
  const { mutateAsync: updateIncident } = useUpdateIncident();

  async function handleSubmit(values: IncidentFormType) {
    if (isNullish(incident)) {
      await createIncident({
        inspectionId: procedureId,
        apiCreateInspectionIncidentRequest: { ...values, externalId: uuidv4() },
      });
    } else {
      await updateIncident({
        inspectionId: procedureId,
        incidentId: incident.incidentId,
        apiUpdateInspectionIncidentRequest: {
          title:
            isEmpty(values.title.trim()) || isChecklistIncident
              ? undefined
              : values.title,
          description: values.description,
        },
      });
    }
    onClose();
  }

  return (
    <Sidebar open={open} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title="Vorkommnis hinzufügen">
              <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid xs={12}>
                  {!isChecklistIncident && (
                    <InputField
                      name="title"
                      label="Titel"
                      required="Bitte einen Titel eingeben."
                    />
                  )}
                  {isChecklistIncident && (
                    <DetailsItem
                      label="Titel"
                      value={
                        incident.title ?? (
                          <Typography
                            data-testid="title.value"
                            component="i"
                            color="neutral"
                            level="title-md"
                          >
                            Keine Angaben
                          </Typography>
                        )
                      }
                    />
                  )}
                </Grid>
                <Grid xs={12}>
                  <TextareaField
                    name="description"
                    label="Beschreibung"
                    required="Bitte eine Beschreibung eingeben."
                  />
                </Grid>
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={isNullish(incident) ? "Hinzufügen" : "Speichern"}
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
