/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiEditorBodyElementsInner,
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateRequest,
  ApiInformationStatementTemplateState,
  PutInformationStatementTemplateRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Grid, Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { useEditorApi } from "@/lib/businessModules/travelMedicine/api/clients";
import {
  useCreateInformationStatementTemplate,
  useUpdateInformationStatementTemplate,
} from "@/lib/businessModules/travelMedicine/api/mutations/informationStatementTemplateApi";
import { useGetAllDiseases } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import {
  useGetTextBlocks,
  useLoadEditor,
} from "@/lib/businessModules/travelMedicine/api/queries/editor";
import { useGetOneInformationStatementTemplate } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import { InformationStatementTemplateMetaInfo } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateMetaInfo";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ContentDisplay } from "@/lib/shared/components/contentEditor/ContentDisplay";
import { ContentEditor } from "@/lib/shared/components/contentEditor/ContentEditor";
import {
  PaletteItem,
  PaletteItemType,
} from "@/lib/shared/components/contentEditor/types";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";

const randomID = uuidv4();

const INITIAL_VALUES: ApiInformationStatementTemplateRequest = {
  name: "",
  title: "",
  state: "DRAFT",
  diseaseIDs: [],
};

interface CreateTemplateFormProps {
  templateId: string;
}

interface CreateTemplateValues {
  name: string;
  title: string;
  state: ApiInformationStatementTemplateState;
  diseaseIDs: OptionalFieldValue<string[]>;
  editorElements?: ApiEditorBodyElementsInner[];
}

function mapFormValues(
  values: CreateTemplateValues,
): ApiInformationStatementTemplateRequest {
  return {
    name: values.name,
    title: values.title,
    state: values.state,
    diseaseIDs: mapRequiredValue(values.diseaseIDs),
    editorElements: values.editorElements,
  };
}

export function InformationStatementTemplateForm(
  props: Readonly<CreateTemplateFormProps>,
) {
  const router = useRouter();
  const informationStatementTemplate = useGetOneInformationStatementTemplate(
    props.templateId,
  );

  const { data: editorData } = useLoadEditor(
    props.templateId ? props.templateId : randomID,
  );
  const { data: textBlocks } = useGetTextBlocks();
  const editorApi = useEditorApi();

  const initialTemplateState: ApiInformationStatementTemplateState =
    informationStatementTemplate.isSuccess
      ? informationStatementTemplate.data.state
      : ApiInformationStatementTemplateState.Draft;
  const templateForForm = informationStatementTemplate.isSuccess
    ? mapDiseaseIds(informationStatementTemplate.data)
    : INITIAL_VALUES;

  const createInformationStatementTemplate =
    useCreateInformationStatementTemplate();
  const updateInformationStatementTemplate =
    useUpdateInformationStatementTemplate();
  const allDiseases = useGetAllDiseases().data.diseases;
  const checkboxStateMap = new Map<string, boolean>();

  const palette: PaletteItem[] = textBlocks.map((textBlock) => {
    return {
      type: PaletteItemType.TEXT,
      name: textBlock.name,
      text: textBlock.content,
    };
  });
  if (palette.length === 0) {
    palette.push({
      type: PaletteItemType.TEXT,
      name: "Textblock",
      text: "Textblock",
    });
  }

  function mapDiseaseIds(
    data: ApiInformationStatementTemplate,
  ): ApiInformationStatementTemplateRequest {
    return {
      ...data,
      diseaseIDs: data.diseases.map((item) => {
        return item.id;
      }),
    };
  }

  async function handleSubmit(values: ApiInformationStatementTemplateRequest) {
    if (isExistingTemplate()) {
      if (isFinalTemplate()) {
        await createCopyOfFinalTemplate(values);
      } else {
        await updateTemplate(values);
      }
    } else {
      await createNewTemplate(values);
    }
  }

  templateForForm.diseaseIDs?.map((checkboxId) =>
    checkboxStateMap.set(checkboxId, true),
  );

  function getSubmitButtonLabel() {
    return templateForForm.state === ApiInformationStatementTemplateState.Draft
      ? "Speichern"
      : "Kopieren";
  }

  function onAddItem(item: PaletteItem) {
    // Right now we only support adding TEXT elements (i.e. textBlocks), and we
    // assume that the provided PaletteItem is of type TEXT. This is guaranteed,
    // see above.
    const editorElement: ApiEditorBodyElementsInner = {
      id: uuidv4(), // temp id, will be replaced by server
      type: "TEXT",
      text: item.text,
      deletable: true,
      editable: true,
      moveable: true,
      highlighted: false,
    };
    return editorElement;
  }

  function isExistingTemplate() {
    return props.templateId.length > 0;
  }

  function isFinalTemplate() {
    return initialTemplateState === ApiInformationStatementTemplateState.Final;
  }

  async function createCopyOfFinalTemplate(
    values: ApiInformationStatementTemplateRequest,
  ) {
    const modifiedValues = {
      ...values,
      name: "Kopie von " + values.name,
      state: ApiInformationStatementTemplateState.Draft,
      diseaseIDs: Array.from(checkboxStateMap.keys()),
    };
    await createInformationStatementTemplate
      .mutateAsync(
        mapFormValues({
          ...modifiedValues,
          editorElements: editorData.editorBody.elements,
        }),
        {
          onSuccess: (res) =>
            router.push(routes.informationStatementTemplates.details(res.id)),
        },
      )
      .catch();
  }

  async function updateTemplate(
    values: ApiInformationStatementTemplateRequest,
  ) {
    const modifiedValues = {
      ...values,
      diseaseIDs: Array.from(checkboxStateMap.keys()),
    };
    const request: PutInformationStatementTemplateRequest = {
      id: props.templateId,
      apiInformationStatementTemplateRequest: modifiedValues,
    };
    await updateInformationStatementTemplate.mutateAsync(request);
  }

  async function createNewTemplate(
    values: ApiInformationStatementTemplateRequest,
  ) {
    const modifiedValues = {
      ...values,
      diseaseIDs: Array.from(checkboxStateMap.keys()),
    };
    await createInformationStatementTemplate
      .mutateAsync(mapFormValues(modifiedValues), {
        onSuccess: (res) => {
          router.push(routes.informationStatementTemplates.details(res.id));
        },
      })
      .catch();
  }

  return (
    <Stack gap={2}>
      <Formik
        initialValues={templateForForm}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit, setFieldValue }) => (
          <FormSheet
            onSubmit={handleSubmit}
            data-testid="information-statement-template-metadata"
          >
            <InformationStatementTemplateMetaInfo
              templateId={props.templateId}
              state={templateForForm.state}
              allDiseases={allDiseases}
              checkboxStateMap={checkboxStateMap}
              setFieldValue={setFieldValue}
            />
            <Grid xs={12}>
              <FormButtonBar
                submitLabel={getSubmitButtonLabel()}
                submitting={isSubmitting}
              />
            </Grid>
          </FormSheet>
        )}
      </Formik>
      {initialTemplateState === ApiInformationStatementTemplateState.Final && (
        <ContentDisplay elements={editorData.editorBody.elements} />
      )}
      {props.templateId.length > 0 &&
        initialTemplateState !== ApiInformationStatementTemplateState.Final && (
          <ContentEditor
            editorData={editorData}
            palette={palette}
            editorApi={editorApi}
            onAddItem={onAddItem}
          />
        )}
    </Stack>
  );
}
