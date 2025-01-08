/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLSectionElementsInner,
  ApiCLSeparatorElement,
  ApiChecklist,
  ApiGetChecklistsResponseFromJSON,
  ApiGetChecklistsResponseToJSON,
  ApiUpdateChecklistRequest,
} from "@eshg/employee-portal-api/inspection";

import { getFromApiCache, writeToApiCache } from "@/serviceWorker/sw/cache";
import {
  createIncident,
  deleteIncident,
} from "@/serviceWorker/sw/inspection/service/updateIncidents";
import { advanceToExecutingPhase } from "@/serviceWorker/sw/inspection/service/updateInspection";

export function getApiInspectionChecklistPath(inspectionId: string) {
  return `/api/inspection/checklists/${inspectionId}`;
}

export async function updateChecklist(
  updateChecklistRequest: ApiUpdateChecklistRequest,
  checklistId: string,
  inspectionId: string,
): Promise<ApiChecklist> {
  const getRequestPath = getApiInspectionChecklistPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);
  const checklistsResponse = ApiGetChecklistsResponseFromJSON(
    await response.json(),
  );

  const checklistUpdates = updateChecklistRequest.checklist?.elements ?? [];

  const checklistIndex = checklistsResponse.checklists.findIndex(
    (checklist) => checklist.id === checklistId,
  );
  const checklist = checklistsResponse.checklists[checklistIndex];
  if (!checklist) {
    throw new Error(
      `Checklist ${checklistId} not found in inspection ${inspectionId} cache entry`,
    );
  }

  for (const checklistUpdate of checklistUpdates) {
    const indexedElement = getChecklistElement(checklist, checklistUpdate.id);
    if (!indexedElement) {
      throw new Error(
        `Checklist element ${checklistUpdate.id} not found in checklist ${checklistId} of inspection ${inspectionId} cache entry`,
      );
    }
    const { checklistElement, sectionIndex, elementIndex } = indexedElement;

    Object.assign(checklistElement, checklistUpdate);

    await deleteIncident(inspectionId, checklistUpdate.id);
    if (checklistUpdate.incident) {
      await createIncident({
        inspectionId,
        incidentId: checklistUpdate.id,
        title: checklistElement.context.text ?? "",
        description: getIncidentDescription(checklistElement),
        // 1-based indexing so the Fortran-programmers feel welcome
        checklistNumber: checklistIndex + 1,
        sectionNumber: sectionIndex + 1,
        elementNumber: elementIndex + 1,
      });
    }
  }

  await writeToApiCache(
    getRequestPath,
    new Response(
      JSON.stringify(ApiGetChecklistsResponseToJSON(checklistsResponse)),
      response,
    ),
  );

  await advanceToExecutingPhase(inspectionId);

  return checklist;
}

function getChecklistElement(
  checklist: ApiChecklist,
  id: string,
):
  | {
      checklistElement: Exclude<
        ApiCLSectionElementsInner,
        {
          type: "SEPARATOR" | "CLSeparatorElement";
        } & ApiCLSeparatorElement
      >;
      sectionIndex: number;
      elementIndex: number;
    }
  | undefined {
  const elementIndices = checklist.sections.map((section) =>
    section.elements.findIndex(
      (element) => "id" in element && element.id === id,
    ),
  );
  const sectionIndex = elementIndices.findIndex(
    (elementIndex) => elementIndex >= 0,
  );
  if (sectionIndex < 0) {
    return undefined;
  }
  const elementIndex = elementIndices[sectionIndex]!;
  const checklistElement =
    checklist.sections[sectionIndex]!.elements[elementIndex]!;
  if (
    "SEPARATOR" === checklistElement.type ||
    "CLSeparatorElement" === checklistElement.type
  ) {
    throw new Error();
  }
  return { checklistElement, sectionIndex, elementIndex };
}

function getIncidentDescription(
  checklistElement: Exclude<
    ApiCLSectionElementsInner,
    {
      type: "SEPARATOR" | "CLSeparatorElement";
    } & ApiCLSeparatorElement
  >,
): string {
  switch (checklistElement.type) {
    case "AUDIO":
    case "CLAudioField":
      return "";
    case "CHECKBOX":
    case "CLCheckboxField":
      return (
        (checklistElement.checked
          ? checklistElement.context.textModuleTrue
          : checklistElement.context.textModuleFalse) ?? ""
      );
    case "IMAGE":
    case "CLImageField":
      return "";
    case "MULTI_SELECT":
    case "CLMultiSelectField":
      return (
        checklistElement.context.items
          ?.filter((i) => checklistElement.checkedButtonNames.includes(i.text))
          .map((i) => i.textModuleTrue)
          .join("\n") ?? ""
      );
    case "SINGLE_SELECT":
    case "CLSingleSelectField":
      if (checklistElement.checkedButtonName == null) return "";
      return (
        checklistElement.context.items?.find(
          (i) => i.text === checklistElement.checkedButtonName,
        )?.textModuleTrue ?? ""
      );
    case "TEXT":
    case "CLTextField":
      return checklistElement.input ?? "";
  }
}
