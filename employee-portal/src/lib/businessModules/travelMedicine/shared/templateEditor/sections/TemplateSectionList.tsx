/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiTemplateSection } from "@eshg/travel-medicine-api";
import { CreateNewFolder } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { FieldArray } from "formik";

import { SectionTitle } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/SectionTitle";
import { TemplateSection } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSection";

export function createEmptySection() {
  const section: ApiTemplateSection = {
    sectionTitle: "",
    sectionElements: [],
  };
  return section;
}

export interface MedicalHistoryTemplateSectionListProp {
  sections: ApiTemplateSection[];
}

export function TemplateSectionList(
  props: Readonly<MedicalHistoryTemplateSectionListProp>,
) {
  const snackbar = useSnackbar();
  const sectionsFormikPath = "sections";

  function getSectionPath(index: number) {
    return `${sectionsFormikPath}[${index}]`;
  }

  function sectionDeleteHandler(
    index: number,
    remove: (index: number) => void,
  ) {
    if (props.sections.length > 1) {
      remove(index);
    } else {
      snackbar.error(
        "Der Anamnesebogen muss mindestens eine Sektion beinhalten",
      );
    }
  }

  return (
    <FieldArray name={sectionsFormikPath} validateOnChange={false}>
      {({ push, remove }) => (
        <>
          {props.sections.map((section, index) => (
            <TemplateSection
              sectionFormikPath={getSectionPath(index)}
              sectionElements={section.sectionElements}
              sectionTitle={
                <SectionTitle
                  sectionDeleteHandler={() =>
                    sectionDeleteHandler(index, remove)
                  }
                  sectionFormikPath={getSectionPath(index)}
                  label={`Titel ${index + 1}. Sektion`}
                />
              }
              sectionIndex={index}
              key={index}
            />
          ))}
          <Button
            startDecorator={<CreateNewFolder />}
            variant="plain"
            sx={{ alignSelf: "flex-start", marginTop: 3 }}
            onClick={() => push(createEmptySection())}
          >
            Neue Sektion erstellen
          </Button>
        </>
      )}
    </FieldArray>
  );
}
