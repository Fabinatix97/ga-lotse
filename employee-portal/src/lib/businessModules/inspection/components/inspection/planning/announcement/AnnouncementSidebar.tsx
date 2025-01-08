/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspectionAnnouncement,
  ApiInspectionAnnouncementType,
} from "@eshg/employee-portal-api/inspection";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { Grid } from "@mui/joy";
import { Formik } from "formik";
import { isNullish } from "remeda";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { translateInspectionAnnouncement } from "@/lib/businessModules/inspection/shared/enums";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { RadioButtonsField } from "@/lib/shared/components/formFields/RadioButtonsField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface AnnouncementSidebarProps {
  open: boolean;
  onClose: () => void;
  announcement?: ApiInspectionAnnouncement;
  procedureId: string;
}

interface AnnouncementFormType {
  type: ApiInspectionAnnouncementType;
  date: string;
}

const ANNOUNCEMENT_TYPE_OPTIONS = Object.values(
  ApiInspectionAnnouncementType,
).map((value) => {
  return { label: translateInspectionAnnouncement(value), value: value };
});

export function AnnouncementSidebar({
  open,
  onClose,
  procedureId,
  announcement,
}: Readonly<AnnouncementSidebarProps>) {
  function handleClose() {
    onClose();
  }

  const { mutateAsync: updateInspection } = useUpdateInspection();

  async function handleSubmit(values: AnnouncementFormType) {
    await updateInspection(
      {
        id: procedureId,
        apiUpdateInspectionRequest: {
          announcementDto: {
            date: toUtcDate(values.date),
            type: values.type,
          },
        },
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  const initialValues: AnnouncementFormType = isNullish(announcement)
    ? {
        date: toDateString(new Date()),
        type: ApiInspectionAnnouncementType.Email,
      }
    : {
        date: toDateString(announcement.date),
        type: announcement.type,
      };

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title="Ankündigung">
              <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid xs={12}>
                  <DateField
                    name="date"
                    label="Datum"
                    required="Bitte ein Datum angeben."
                  />
                </Grid>
                <Grid xs={12}>
                  <RadioButtonsField
                    label="Kommunikationsmittel"
                    name="type"
                    options={ANNOUNCEMENT_TYPE_OPTIONS}
                    required="Bitte ein Kommunikationsmittel auswählen."
                    orientation="vertical"
                  />
                </Grid>
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Speichern"
                submitting={isSubmitting}
                onCancel={handleClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
