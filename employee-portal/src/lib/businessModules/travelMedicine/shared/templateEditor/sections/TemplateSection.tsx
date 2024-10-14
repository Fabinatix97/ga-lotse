/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSectionElement } from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Add } from "@mui/icons-material";
import { Button, Sheet, Stack } from "@mui/joy";
import { FieldArray } from "formik";
import { ReactNode } from "react";

import { createEmptySectionElement } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSectionList";
import { SectionDataElementList } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionDataElementList";

export interface MedicalHistoryTemplateSectionProp {
  sectionFormikPath: string;
  sectionElements: ApiTemplateSectionElement[];
  sectionTitle: ReactNode;
}

export function TemplateSection({
  sectionFormikPath,
  sectionElements,
  sectionTitle,
}: Readonly<MedicalHistoryTemplateSectionProp>) {
  const snackbar = useSnackbar();
  const sectionElementsFormikPath = `${sectionFormikPath}.sectionElements`;

  function deleteSectionElementHandler(
    index: number,
    remove: (index: number) => void,
  ) {
    if (sectionElements.length > 1) {
      remove(index);
    } else {
      snackbar.error(
        "Jede Sektion muss mindestens einen Frageblock beinhalten",
      );
    }
  }

  return (
    <Sheet
      sx={{ marginTop: 3 }}
      aria-label={`section ${sectionFormikPath}`}
      data-testid={"section"}
    >
      <FieldArray
        name={`${sectionElementsFormikPath}`}
        validateOnChange={false}
      >
        {({ push, remove, replace }) => (
          <Stack direction="row" spacing={2}>
            <Stack
              flex={1}
              direction="column"
              spacing={2}
              data-testid={sectionFormikPath}
              sx={{ maxWidth: "100%" }}
            >
              {sectionTitle}

              <SectionDataElementList
                sectionElementsFormikPath={`${sectionElementsFormikPath}`}
                sectionElements={sectionElements}
                sectionElementDeleteHandler={(index) =>
                  deleteSectionElementHandler(index, remove)
                }
                replaceSectionElementHandler={replace}
              />

              <Button
                startDecorator={<Add />}
                variant="outlined"
                color="primary"
                onClick={() => push(createEmptySectionElement())}
              >
                Frage hinzufügen
              </Button>
            </Stack>
          </Stack>
        )}
      </FieldArray>
    </Sheet>
  );
}
