/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateRequest,
  ApiInformationStatementTemplateState,
  ApiTemplateSection,
  PutInformationStatementTemplateRequest,
} from "@eshg/travel-medicine-api";
import { Box } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import {
  useCreateInformationStatementTemplate,
  useUpdateInformationStatementTemplate,
} from "@/lib/businessModules/travelMedicine/api/mutations/informationStatementTemplateApi";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetOneInformationStatementTemplate } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { TemplateEditorButtonBar } from "@/lib/businessModules/travelMedicine/shared/templateEditor/TemplateEditorButtonBar";
import { TemplateEditorMainContent } from "@/lib/businessModules/travelMedicine/shared/templateEditor/TemplateEditorMainContent";
import { createEmptySection } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSectionList";

import { InformationStatementTemplateMetaInfo } from "./InformationStatementTemplateMetaInfo";

interface CreateTemplateFormProps {
  templateId: string;
}

interface TemplateValues {
  name: string;
  title: string;
  state: ApiInformationStatementTemplateState;
  diseaseIDs?: string[];
  sections: ApiTemplateSection[];
}

function createTemplateRequest(
  values: TemplateValues,
  state: ApiInformationStatementTemplateState,
): ApiInformationStatementTemplateRequest {
  return {
    name: values.name,
    title: values.title,
    state,
    diseaseIDs: values.diseaseIDs,
    content: { sections: values.sections },
  };
}

export function getTemplateName(template: ApiInformationStatementTemplate) {
  return template.state === ApiInformationStatementTemplateState.Final
    ? `Kopie von: ${template.name}`
    : template.name;
}

export function InformationStatementTemplateEditor(
  props: Readonly<CreateTemplateFormProps>,
) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const informationStatementTemplate = useGetOneInformationStatementTemplate(
    props.templateId,
  );
  const createInformationStatementTemplate =
    useCreateInformationStatementTemplate();
  const updateInformationStatementTemplate =
    useUpdateInformationStatementTemplate();
  const [{ data: allDiseases }] = useSuspenseQueries({
    queries: [useGetAllDiseasesQuery()],
  });

  const isExistingTemplate = !!props.templateId;

  let newTemplateState: ApiInformationStatementTemplateState =
    ApiInformationStatementTemplateState.Draft;

  const template: TemplateValues = {
    name: "",
    title: "",
    state: ApiInformationStatementTemplateState.Draft,
    diseaseIDs: [],
    sections: [createEmptySection()],
  };

  if (isExistingTemplate) {
    const data = informationStatementTemplate.data;
    if (data) {
      template.name = getTemplateName(data);
      template.title = data.title;
      template.sections = data.content.sections;
      template.state = data.state;
      template.diseaseIDs = data.diseases.map((disease) => disease.id);
    }
  }

  async function handleSubmit(values: TemplateValues) {
    if (hasEmptySectionElements(values)) {
      snackbar.error(
        "Alle Sektionen des Aufklärungsbogens müssen ausgefüllt sein.",
      );
    } else {
      await handleBackendCall(values);
    }
  }

  function hasEmptySectionElements(values: TemplateValues) {
    return values.sections
      .map((section) => section.sectionElements)
      .some((sectionElements) => sectionElements.length === 0);
  }

  async function handleBackendCall(values: TemplateValues) {
    if (isExistingTemplate) {
      await updateOrCreateNewCopyOnServer(values);
    } else {
      await createNewTemplate(values);
    }
  }

  async function updateOrCreateNewCopyOnServer(values: TemplateValues) {
    if (values.state === ApiInformationStatementTemplateState.Final) {
      await createNewTemplate(values);
    } else {
      await updateTemplate(values);
    }
  }

  async function updateTemplate(values: TemplateValues) {
    const request: PutInformationStatementTemplateRequest = {
      id: props.templateId,
      apiInformationStatementTemplateRequest: createTemplateRequest(
        values,
        newTemplateState,
      ),
    };
    await updateInformationStatementTemplate.mutateAsync(request, {
      onSuccess: () => router.push(routes.informationStatementTemplates.index),
    });
  }

  async function createNewTemplate(values: TemplateValues) {
    await createInformationStatementTemplate.mutateAsync(
      createTemplateRequest(values, newTemplateState),
      {
        onSuccess: () =>
          router.push(routes.informationStatementTemplates.index),
      },
    );
  }

  return (
    <Formik initialValues={template} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, values }) => (
        <FormPlus
          sx={{ height: "100%", overflow: "hidden" }}
          data-testid="information-statement-template-metadata"
        >
          <Box
            sx={{
              pt: 3,
              pr: 3,
              pb: 15,
              pl: 3,
              height: "100%",
              overflow: "auto",
            }}
          >
            <TemplateEditorMainContent
              sections={values.sections}
              headSection={
                <InformationStatementTemplateMetaInfo
                  allDiseases={allDiseases}
                />
              }
            />
          </Box>
          <TemplateEditorButtonBar
            isSubmitting={isSubmitting}
            publish={() => {
              newTemplateState = ApiInformationStatementTemplateState.Final;
            }}
            save={() => {
              newTemplateState = ApiInformationStatementTemplateState.Draft;
            }}
            cancelRoute={routes.informationStatementTemplates.index}
            disabled={informationStatementTemplate.isLoading}
          />
        </FormPlus>
      )}
    </Formik>
  );
}
