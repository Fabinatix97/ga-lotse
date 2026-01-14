/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { FormPlus, useSnackbar } from "@eshg/lib-portal";
import {
  ApiMedicalHistoryTemplate,
  ApiMedicalHistoryTemplateState,
  ApiTemplateSection,
} from "@eshg/travel-medicine-api";

import {
  PutMedicalHistoryTemplateRequest,
  usePostMedicalHistoryTemplate,
  usePutMedicalHistoryTemplate,
} from "@/lib/businessModules/travelMedicine/api/mutations/medicalHistoryTemplates";
import { useGetOneMedicalHistoryTemplate } from "@/lib/businessModules/travelMedicine/api/queries/medicalHistoryTemplates";
import { MedicalHistoryTemplateTitle } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateTitle";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { TemplateEditorButtonBar } from "@/lib/businessModules/travelMedicine/shared/templateEditor/TemplateEditorButtonBar";
import { TemplateEditorMainContent } from "@/lib/businessModules/travelMedicine/shared/templateEditor/TemplateEditorMainContent";
import { createEmptySection } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSectionList";

function getTemplateTitle(template: ApiMedicalHistoryTemplate) {
  return template.state === ApiMedicalHistoryTemplateState.Final
    ? `Kopie von: ${template.title}`
    : template.title;
}

interface FormTemplate {
  title: string;
  state: ApiMedicalHistoryTemplateState;
  sections: ApiTemplateSection[];
}

export function MedicalHistoryTemplateEditor(
  props: Readonly<{ templateId?: string }>,
) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const postMedicalHistoryTemplate = usePostMedicalHistoryTemplate();
  const putMedicalHistoryTemplate = usePutMedicalHistoryTemplate();
  // useGetOneMedicalHistoryTemplate doesn't call the backend when templateId is an empty string (see enabled flag)
  const medicalHistoryTemplateResult = useGetOneMedicalHistoryTemplate(
    props.templateId ?? "",
  );

  const template: FormTemplate = {
    title: "",
    state: ApiMedicalHistoryTemplateState.Draft,
    sections: [createEmptySection()],
  };

  let templateStateToSave: ApiMedicalHistoryTemplateState =
    ApiMedicalHistoryTemplateState.Draft;

  const editExistingTemplate = !!props.templateId;
  if (editExistingTemplate) {
    const data = medicalHistoryTemplateResult.data;
    if (data) {
      template.title = getTemplateTitle(data);
      template.sections = data.content.sections;
      template.state = data.state;
    }
  }

  async function onSubmit(values: FormTemplate) {
    if (editExistingTemplate) {
      await updateOrCreateNewCopyOnServer(props.templateId, values);
    } else {
      if (hasEmptySectionElements(values)) {
        snackbar.error(
          "Der Anamnesebogen muss mindestens eine ausgefüllte Sektion beinhalten.",
        );
      } else {
        await postTemplate(values);
      }
    }
  }

  function hasEmptySectionElements(values: FormTemplate) {
    return values.sections
      .map((section) => section.sectionElements)
      .some((sectionElements) => sectionElements.length === 0);
  }

  async function updateOrCreateNewCopyOnServer(
    templateId: string,
    values: FormTemplate,
  ) {
    if (values.state === ApiMedicalHistoryTemplateState.Final) {
      await postTemplate(values);
    } else {
      const request = createPutRequestForMedicalHistoryTemplate(
        templateId,
        values,
      );

      await putMedicalHistoryTemplate.mutateAsync(request, {
        onSuccess: () => {
          router.push(routes.medicalHistoryTemplates.index);
        },
      });
    }
  }

  function createPutRequestForMedicalHistoryTemplate(
    templateId: string,
    values: FormTemplate,
  ) {
    const putRequest: PutMedicalHistoryTemplateRequest = {
      id: templateId,
      request: createPostPutRequest(values),
    };
    return putRequest;
  }

  function createPostPutRequest(values: FormTemplate) {
    return {
      title: values.title,
      content: { sections: values.sections },
      state: templateStateToSave,
    };
  }

  async function postTemplate(values: FormTemplate) {
    const request = createPostPutRequest(values);
    await postMedicalHistoryTemplate.mutateAsync(request, {
      onSuccess: () => {
        router.push(routes.medicalHistoryTemplates.index);
      },
    });
  }

  return (
    <Formik
      initialValues={template}
      validateOnChange={false}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => (
        <FormPlus sx={{ height: "100%", overflow: "hidden" }}>
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
              headSection={<MedicalHistoryTemplateTitle />}
            />
          </Box>
          <TemplateEditorButtonBar
            isSubmitting={isSubmitting}
            publish={() => {
              templateStateToSave = ApiMedicalHistoryTemplateState.Final;
            }}
            save={() => {
              templateStateToSave = ApiMedicalHistoryTemplateState.Draft;
            }}
            cancelRoute={routes.medicalHistoryTemplates.index}
            disabled={medicalHistoryTemplateResult.isLoading}
          />
        </FormPlus>
      )}
    </Formik>
  );
}
