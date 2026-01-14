/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CreateNewFolder } from "@mui/icons-material";
import { Box, Button } from "@mui/joy";

import { FieldArrayWithFocus, useSnackbar } from "@eshg/lib-portal";
import { ApiTemplateSection } from "@eshg/travel-medicine-api";

import { SectionTitle } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/SectionTitle";
import { TemplateSection } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSection";

export function createEmptySection() {
  const section: ApiTemplateSection = {
    sectionTitle: "",
    sectionElements: [],
  };
  return section;
}

interface MedicalHistoryTemplateSectionListProp {
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
    <FieldArrayWithFocus
      name={sectionsFormikPath}
      validateOnChange={false}
      valueLength={props.sections.length}
    >
      {({ push, remove, setInputElementRef }) => (
        <>
          <Box role="list" display="contents">
            {props.sections.map((section, index) => (
              <Box key={index} display="contents" role="listitem">
                <TemplateSection
                  sectionFormikPath={getSectionPath(index)}
                  sectionElements={section.sectionElements}
                  sectionTitle={
                    <SectionTitle
                      setInputElementRef={(el) => setInputElementRef(el, index)}
                      sectionDeleteHandler={() =>
                        sectionDeleteHandler(index, remove)
                      }
                      sectionFormikPath={getSectionPath(index)}
                      label={`Titel ${index + 1}. Sektion`}
                      showDeleteSectionButton={props.sections.length > 1}
                    />
                  }
                  sectionIndex={index}
                />
              </Box>
            ))}
          </Box>
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
    </FieldArrayWithFocus>
  );
}
