/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { useAddGeoShape } from "@/lib/businessModules/statistics/api/mutations/useAddGeoShape";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { DeletableFileField } from "@/lib/shared/components/formFields/file/DeletableFileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface AddGeoShapeValues {
  file: File | null;
  title: string;
}

export function ImportGeoShapeSidebar(props: {
  open: boolean;
  onClose: () => void;
}) {
  const initialValues: AddGeoShapeValues = {
    file: null,
    title: "",
  };

  const addGeoShape = useAddGeoShape();

  async function handleSubmit(values: AddGeoShapeValues) {
    await addGeoShape(values, {
      onSuccess: props.onClose,
    });
  }

  return (
    <Sidebar open={props.open} onClose={props.onClose}>
      {props.open && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, handleSubmit }) => (
            <SidebarForm onSubmit={handleSubmit}>
              <SidebarContent title="Daten importieren">
                <Stack gap={3}>
                  <DeletableFileField
                    name="file"
                    label="Karten-Datei für den Import auswählen:"
                    required="Bitte Shapefile importieren."
                    accept={FileType.Geojson}
                    placeholder=".geojson"
                  />
                  <InputField
                    name="title"
                    label="Name für Choroplethenkarte"
                    required="Bitte Namen angeben."
                    hint="Der Name wird in der Kartenauswahl angezeigt."
                  />
                </Stack>
              </SidebarContent>
              <SidebarActions>
                <FormButtonBar
                  left={
                    <Button variant="plain" onClick={props.onClose}>
                      Abbrechen
                    </Button>
                  }
                  submitLabel="Speichern"
                  submitting={isSubmitting}
                />
              </SidebarActions>
            </SidebarForm>
          )}
        </Formik>
      )}
    </Sidebar>
  );
}
