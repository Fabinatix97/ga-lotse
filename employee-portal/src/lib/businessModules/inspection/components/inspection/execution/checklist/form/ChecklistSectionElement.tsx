/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiUpdateChecklistElementsInner,
  ApiUpdateChecklistRequest,
} from "@eshg/employee-portal-api/inspection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Stack } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { Formik, useFormikContext } from "formik";
import { ChangeEvent, createElement, useEffect, useMemo, useRef } from "react";
import { isNonNullish } from "remeda";
import { useDebouncedCallback } from "use-debounce";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  useUpdateChecklist,
  useUploadChecklistFile,
} from "@/lib/businessModules/inspection/api/mutations/checklist";
import { getChecklistsQueryKey } from "@/lib/businessModules/inspection/api/queries/checklist";
import { useChecklistValidateContext } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/ChecklistValidateContext";
import { ChecklistIncidentToggle } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistIncidentToggle";
import {
  CLFormElement,
  FormAudioField,
  FormImageField,
  mapToUpdateElement,
} from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";
import { compressImage } from "@/lib/shared/helpers/imageCompressor";

import { ChecklistCheckboxElement } from "./ChecklistCheckboxElement";
import { ChecklistFileElement } from "./ChecklistFileElement";
import { ChecklistMultiSelectElement } from "./ChecklistMultiSelectElement";
import { ChecklistRadioButtonElement } from "./ChecklistRadioButtonElement";
import { ChecklistTextareaElement } from "./ChecklistTextareaElement";

interface ChecklistSectionElementProps {
  inspectionExternalId: string;
  checklistId: string;
  element: CLFormElement;
  sectionIndex: number;
  elementIndex: number;
  readOnly?: boolean;
}

export function ChecklistSectionElement({
  inspectionExternalId,
  checklistId,
  element,
  sectionIndex,
  elementIndex,
  readOnly,
}: Readonly<ChecklistSectionElementProps>) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateChecklist } = useUpdateChecklist();
  const { mutateAsync: uploadChecklistFile } = useUploadChecklistFile();

  const label = useMemo(() => {
    const label = element.context.text;
    return `${sectionIndex + 1}.${elementIndex + 1}. ${label}`;
  }, [element, elementIndex, sectionIndex]);
  async function sendUpdateRequest(request: ApiUpdateChecklistRequest) {
    await updateChecklist({
      inspectionExternalId,
      checklistId,
      apiUpdateChecklistRequest: request,
    });
  }

  const sendUpdateWithDebounce = useDebouncedCallback(sendUpdateRequest, 500);

  async function sendUpdateWithDebounceAndCancel(
    request: ApiUpdateChecklistRequest,
  ) {
    await sendUpdateWithDebounce(request);
    // updating the checklist will force a refetch,
    // this would cause the input to ruberband back to the old value
    // to prevent this we cancel the query as soon as the input is changed.
    // Because the update is debounced and thus happens after this line,
    // only the last invalidation will be allowed to go through.
    await queryClient.cancelQueries({
      queryKey: getChecklistsQueryKey(inspectionExternalId),
    });
  }

  async function handleSubmit(changedElement: CLFormElement) {
    const updateElement = mapToUpdateElement(changedElement);

    if (changedElement.type === "IMAGE") {
      await submitImageElement(changedElement, updateElement);
    } else if (changedElement.type === "AUDIO") {
      await submitAudioElement(changedElement, updateElement);
    } else {
      await submitElement(updateElement, changedElement);
    }
  }

  async function submitFileElement(
    file: File,
    changedElement: FormImageField | FormAudioField,
    updateElement: ApiUpdateChecklistElementsInner,
  ) {
    await uploadChecklistFile({
      file,
      inspectionExternalId,
      checklistId,
      updateElementDto: updateElement,
    }).catch(() => {
      changedElement.file = null;
    });
    await queryClient.invalidateQueries({
      queryKey: getChecklistsQueryKey(inspectionExternalId),
    });
  }

  async function submitAudioElement(
    changedElement: FormAudioField,
    updateElement: ApiUpdateChecklistElementsInner,
  ) {
    const { file } = changedElement;
    if (!isNonNullish(file)) {
      return;
    }
    await submitFileElement(file, changedElement, updateElement);
  }

  async function submitImageElement(
    changedElement: FormImageField,
    updateElement: ApiUpdateChecklistElementsInner,
  ) {
    const { file } = changedElement;
    if (!isNonNullish(file)) {
      return;
    }
    const compressed = await compressImage(file).catch(() => file);
    await submitFileElement(compressed, changedElement, updateElement);
  }

  async function submitElement(
    updateElement: ApiUpdateChecklistElementsInner,
    changedElement: CLFormElement,
  ) {
    const request: ApiUpdateChecklistRequest = {
      checklist: { elements: [updateElement] },
    };
    if (changedElement.type === "TEXT") {
      await sendUpdateWithDebounceAndCancel(request);
    } else {
      await sendUpdateRequest(request);
    }
  }

  return (
    <Formik initialValues={element} onSubmit={handleSubmit} enableReinitialize>
      <ElementWrapper
        inspectionExternalId={inspectionExternalId}
        label={label}
        readOnly={readOnly}
      />
    </Formik>
  );
}

function ElementWrapper({
  inspectionExternalId,
  label,
  readOnly,
}: Readonly<{
  inspectionExternalId: string;
  label: string;
  readOnly?: boolean;
}>) {
  const {
    values: clFormElement,
    submitForm,
    handleChange,
    validateForm,
    setFieldTouched,
  } = useFormikContext<CLFormElement>();
  const ref = useRef<HTMLDivElement>(null);
  const {
    registerElementForm,
    unregisterElementForm,
    invalidElementIds,
    firstInvalidElementId,
  } = useChecklistValidateContext();

  const elementId = clFormElement.id;

  // This effect registers the form at the ChecklistValidateContext so that we
  // can perform global validation over all forms. It registers a validate
  // function which can be called by the context, and it returns validation errors.
  useEffect(() => {
    // eslint-disable-next-line func-style
    const validate = async () => {
      // validate the form of the current element
      const fieldErrors = await validateForm();
      const errors =
        fieldErrors && Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
      // we must also touch all invalid fields set that the invalid markers are shown
      for (const fieldName of Object.keys(fieldErrors)) {
        await setFieldTouched(fieldName);
      }
      return { elementId, element: ref, errors };
    };

    const form = { validate };
    registerElementForm(form);
    return () => unregisterElementForm(form);
  }, [
    registerElementForm,
    unregisterElementForm,
    validateForm,
    setFieldTouched,
    elementId,
  ]);

  // This effect gets called when the list of invalidElementIds of the surrounding
  // ChecklistValidationContext changes. It checks whether the current element is
  // marked invalid, and in case it enforces a revalidation, making the element
  // be displayed in invalid state. If this element also happens to be the first
  // invalid element, the browser tries to scroll to it.
  useEffect(() => {
    if (invalidElementIds.has(elementId)) {
      void validate();
    }

    async function validate() {
      // validate the form of the current element
      const errors = await validateForm();
      // we must also touch all invalid fields set that the invalid markers are shown
      for (const fieldName of Object.keys(errors)) {
        await setFieldTouched(fieldName);
      }
      // scroll to first invalid element
      if (elementId === firstInvalidElementId) {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [
    elementId,
    invalidElementIds,
    firstInvalidElementId,
    validateForm,
    setFieldTouched,
  ]);

  return (
    <Stack
      ref={ref}
      sx={{
        paddingBlock: 1,
        paddingLeft: 2,
        borderLeft: 3,
        borderColor: clFormElement.incident
          ? theme.palette.danger[500]
          : "transparent",
      }}
    >
      {clFormElement.type === "IMAGE" || clFormElement.type === "AUDIO" ? (
        /* The <FileField> in a <ChecklistFileElement> needs special handling:
           we cannot use an onChange function that calls the handleChange function
           of Formik here. Therefore, we cannot use <AutoSubmitForm> and must
           handle it separately. */
        <ChecklistFileElement
          inspectionExternalId={inspectionExternalId}
          element={clFormElement}
          label={label}
          name={getFieldName(clFormElement.type)}
          onChange={submitForm}
          readOnly={readOnly}
        />
      ) : (
        <AutoSubmitForm
          clFormElement={clFormElement}
          label={label}
          handleChange={handleChange}
          submitForm={submitForm}
          readOnly={readOnly}
        />
      )}
    </Stack>
  );
}

/* A form that automatically submits its (single) element whenever its value changes */
function AutoSubmitForm({
  clFormElement,
  label,
  handleChange,
  submitForm,
  readOnly,
}: Readonly<{
  clFormElement: CLFormElement;
  label: string;
  handleChange: (e: ChangeEvent<unknown>) => void;
  submitForm: (() => Promise<void>) & (() => Promise<unknown>);
  readOnly?: boolean;
}>) {
  const fieldComponent = getFieldComponent(clFormElement.type);
  const fieldComponentProps = {
    name: getFieldName(clFormElement.type),
    element: clFormElement,
    label: label,
    incident: clFormElement.incident,
    labelEndDecorator: (
      <ChecklistIncidentToggle
        element={clFormElement}
        name="incident"
        readOnly={readOnly}
      />
    ),
    readOnly,
  };

  return (
    <FormPlus
      aria-label={clFormElement.type}
      onChange={(e) => {
        if (readOnly) {
          return;
        }
        handleChange(e);
        // immediately submit on each change (if valid), after next tick
        // see https://github.com/jaredpalmer/formik/issues/1218#issuecomment-481707848
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(submitForm, 0);
      }}
    >
      {fieldComponent !== undefined
        ? createElement(fieldComponent, fieldComponentProps)
        : undefined}
    </FormPlus>
  );
}

type FieldType = CLFormElement["type"];

function getFieldName(type: FieldType): string {
  switch (type) {
    case "IMAGE":
    case "AUDIO":
      return "file";
    case "CHECKBOX":
      return "checked";
    case "MULTI_SELECT":
      return "checkedButtonNames";
    case "SINGLE_SELECT":
      return "checkedButtonName";
    case "TEXT":
      return "input";
  }
}

function getFieldComponent(type: FieldType) {
  switch (type) {
    case "IMAGE":
    case "AUDIO":
      return undefined;
    case "CHECKBOX":
      return ChecklistCheckboxElement;
    case "MULTI_SELECT":
      return ChecklistMultiSelectElement;
    case "SINGLE_SELECT":
      return ChecklistRadioButtonElement;
    case "TEXT":
      return ChecklistTextareaElement;
  }
}
