/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLAudioField,
  ApiCLCheckboxField,
  ApiCLImageField,
  ApiCLSectionElementsInner,
  ApiChecklist,
  ApiUpdateChecklistElementsInner,
} from "@eshg/employee-portal-api/inspection";
import { isDefined } from "remeda";

export type FormCheckboxField = Omit<ApiCLCheckboxField, "checked"> & {
  checked: string;
};

export type FormImageField = ApiCLImageField & { file: File | null };
export type FormAudioField = ApiCLAudioField & { file: File | null };

/**
 * simplify intersection type ApiCLSectionElementsInner: remove unused types
 * and replace the 'checked' attribute in ApiCLChecklistElement with a string.
 */
export type CLFormElement =
  | Exclude<
      ApiCLSectionElementsInner,
      | { type: "SEPARATOR" }
      | { type: "CLSeparatorElement" }
      | { type: "CLAudioField" }
      | { type: "CHECKBOX" }
      | { type: "IMAGE" }
      | { type: "AUDIO" }
      | { type: "CLCheckboxField" }
      | { type: "CLImageField" }
      | { type: "CLMultiSelectField" }
      | { type: "CLSingleSelectField" }
      | { type: "CLTextField" }
    >
  | ({ type: "CHECKBOX" } & FormCheckboxField)
  | ({ type: "IMAGE" } & FormImageField)
  | ({ type: "AUDIO" } & FormAudioField);

export function mapToCLFormElement(
  element: ApiCLSectionElementsInner,
): CLFormElement {
  if (
    element.type === "SEPARATOR" ||
    element.type === "CLSeparatorElement" ||
    element.type === "CLCheckboxField" ||
    element.type === "CLTextField" ||
    element.type === "CLAudioField" ||
    element.type === "CLImageField" ||
    element.type === "CLMultiSelectField" ||
    element.type === "CLSingleSelectField"
  ) {
    throw new Error("invalid element type: " + element.type);
  }
  if (element.type === "CHECKBOX") {
    return { ...element, checked: mapBooleanToString(element.checked) };
  } else if (element.type === "IMAGE" || element.type === "AUDIO") {
    return { ...element, file: null };
  } else if (element.type === "SINGLE_SELECT") {
    return {
      ...element,
      checkedButtonName: element.checkedButtonName ?? "",
    };
  } else if (element.type === "MULTI_SELECT") {
    return {
      ...element,
      checkedButtonNames: element.checkedButtonNames ?? [],
    };
  } else {
    return { ...element };
  }
}

export function mapToUpdateElement(
  element: CLFormElement,
): ApiUpdateChecklistElementsInner {
  const commonProps = {
    id: element.id,
    type: element.type,
    incident: element.incident,
  };
  switch (element.type) {
    case "CHECKBOX":
      return {
        ...commonProps,
        checked: mapStringToBoolean(element.checked),
      };
    case "MULTI_SELECT":
      return {
        ...commonProps,
        checkedButtonNames: element.checkedButtonNames,
      };
    case "SINGLE_SELECT":
      return {
        ...commonProps,
        checkedButtonName: element.checkedButtonName,
      };
    case "TEXT":
      return { ...commonProps, input: element.input };
    case "AUDIO":
    case "IMAGE":
      return { ...commonProps };
  }
}

function mapBooleanToString(value: boolean | undefined): string {
  return isDefined(value) ? (value ? "true" : "false") : "";
}

function mapStringToBoolean(value: string): boolean | undefined {
  return value === "true" ? true : value === "false" ? false : undefined;
}

/**
 * Validates all checklists: iterates all checklist elements and returns the
 * invalid ones (i.e. the ones with missing input), and the first invalid
 * elementId and checklistId.
 *
 * Note that this validation checks the committed _model state_, not the
 * currently open editor values. Therefore, it can validate even the elements
 * which are currently not being displayed because they are not in the active tab.
 */
export function validateAllChecklists(checklists: ApiChecklist[]): {
  invalidElementIds: Map<string, string>;
  firstInvalidElementId: string | null;
  firstInvalidChecklistId: string | null;
} {
  const invalidElementIds = new Map<string, string>();
  let firstInvalidElementId = null;
  let firstInvalidChecklistId = null;
  for (const checklist of checklists) {
    for (const section of checklist.sections) {
      for (const element of section.elements) {
        if (element.type === "SEPARATOR") continue;
        const clFormElement = mapToCLFormElement(element);
        if (!isValid(clFormElement)) {
          invalidElementIds.set(clFormElement.id, checklist.id);
          if (firstInvalidElementId === null) {
            firstInvalidElementId = clFormElement.id;
            firstInvalidChecklistId = checklist.id;
          }
        }
      }
    }
  }
  return {
    invalidElementIds,
    firstInvalidElementId,
    firstInvalidChecklistId,
  };
}

function isValid(element: CLFormElement) {
  return !element.context.mandatory || hasInput(element);
}

function hasInput(element: CLFormElement) {
  switch (element.type) {
    case "TEXT":
      return !!element.input?.trim();
    case "AUDIO":
    case "IMAGE":
      return true;
    case "MULTI_SELECT":
      return element.checkedButtonNames.some((name) => !!name);
    case "SINGLE_SELECT":
      return !!element.checkedButtonName;
    case "CHECKBOX":
      return !!element.checked;
  }
}
