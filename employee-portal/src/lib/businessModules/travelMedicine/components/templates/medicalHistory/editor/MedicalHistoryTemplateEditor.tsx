/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiMedicalHistoryTemplate,
  ApiMedicalHistoryTemplateSection,
  ApiMedicalHistoryTemplateState,
} from "@eshg/employee-portal-api/travelMedicine/models";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import {
  PutMedicalHistoryTemplateRequest,
  usePostMedicalHistoryTemplate,
  usePutMedicalHistoryTemplate,
} from "@/lib/businessModules/travelMedicine/api/mutations/medicalHistoryTemplates";
import { useGetOneMedicalHistoryTemplate } from "@/lib/businessModules/travelMedicine/api/queries/medicalHistoryTemplates";
import { MedicalHistoryTemplateButtonBar } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/MedicalHistoryTemplateButtonBar";
import { MedicalHistoryTemplateContent } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/MedicalHistoryTemplateContent";
import { createEmptySection } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/sections/TemplateSectionList";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export function getTemplateTitle(template: ApiMedicalHistoryTemplate) {
  return template.state === ApiMedicalHistoryTemplateState.Final
    ? `Kopie von: ${template.title}`
    : template.title;
}

export interface FormTemplate {
  title: string;
  state: ApiMedicalHistoryTemplateState;
  sections: ApiMedicalHistoryTemplateSection[];
}

export function MedicalHistoryTemplateEditor(
  props: Readonly<{ templateId?: string }>,
) {
  const router = useRouter();
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
      await postTemplate(values);
    }
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
        <FormPlus style={{ height: "100%", overflow: "hidden" }}>
          <MedicalHistoryTemplateContent sections={values.sections} />
          <MedicalHistoryTemplateButtonBar
            isSubmitting={isSubmitting}
            publish={() => {
              templateStateToSave = ApiMedicalHistoryTemplateState.Final;
            }}
            save={() => {
              templateStateToSave = ApiMedicalHistoryTemplateState.Draft;
            }}
            cancelRoute={routes.medicalHistoryTemplates.index}
          />
        </FormPlus>
      )}
    </Formik>
  );
}
