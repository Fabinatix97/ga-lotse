/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiTemplateSection,
  ApiTemplateSectionElement,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { CreateNewFolder } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { FieldArray } from "formik";

import { SectionTitle } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/SectionTitle";
import { TemplateSection } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSection";

export function createEmptySection() {
  const section: ApiTemplateSection = {
    sectionTitle: "",
    sectionElements: [createEmptySectionElement()],
  };
  return section;
}

export function createEmptySectionElement() {
  const sectionElement: ApiTemplateSectionElement = {
    elementData: createEmptySectionElementData(),
    elementType: "option",
  };
  return sectionElement;
}

export function createEmptySectionElementData() {
  return {
    questionText: "",
    subElementMultiSelect: [],
    subElementText: undefined,
  };
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
                />
              }
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
