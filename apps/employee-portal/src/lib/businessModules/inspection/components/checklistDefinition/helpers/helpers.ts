/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { v4 as uuidv4 } from "uuid";

import { ApiUserRole } from "@eshg/base-api";
import {
  type ApiCLAudioContext,
  type ApiCLCheckboxContext,
  type ApiCLImageContext,
  type ApiCLMultiSelectContext,
  ApiCLSectionContextElementsInner,
  ApiCLSeparatorContext,
  ApiCLSingleSelectContext,
  type ApiCLTextElementContext,
  ApiChecklistDefinitionVersion,
} from "@eshg/inspection-api";
import { useHasUserRolesCheck } from "@eshg/lib-employee-portal";
import { ConfirmationDialogProps } from "@eshg/lib-portal";

function getId(
  partial: Partial<ApiCLSectionContextElementsInner>,
  keepId: boolean,
) {
  return (keepId ? partial.id : undefined) ?? uuidv4();
}

function getItems(partial: Partial<ApiCLSectionContextElementsInner>) {
  return (
    (partial.type === "MULTI_SELECT" || partial.type === "SINGLE_SELECT"
      ? partial?.items
      : undefined) ?? [
      {
        id: uuidv4(),
        text: "",
        textModuleFalse: "",
        textModuleTrue: "",
      },
      {
        id: uuidv4(),
        text: "",
        textModuleFalse: "",
        textModuleTrue: "",
      },
    ]
  );
}

function createCheckboxElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "CHECKBOX" } & ApiCLCheckboxContext {
  return {
    text: "",
    mandatory: false,
    help: "",
    note: "",
    ...partial,
    type: "CHECKBOX",
    id: getId(partial, keepId),
  };
}

function createMultiselectElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "MULTI_SELECT" } & ApiCLMultiSelectContext {
  return {
    text: "",
    mandatory: false,
    help: "",
    note: "",
    ...partial,
    type: "MULTI_SELECT",
    id: getId(partial, keepId),
    items: getItems(partial),
  };
}

function createSingleSelectElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "SINGLE_SELECT" } & ApiCLSingleSelectContext {
  return {
    text: "",
    mandatory: false,
    help: "",
    note: "",
    ...partial,
    type: "SINGLE_SELECT",
    id: getId(partial, keepId),
    items: getItems(partial),
  };
}

function createTextElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "TEXT" } & ApiCLTextElementContext {
  return {
    text: "",
    mandatory: false,
    help: "",
    note: "",
    ...partial,
    type: "TEXT",
    id: getId(partial, keepId),
  };
}

function createImageElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "IMAGE" } & ApiCLImageContext {
  return {
    text: "",
    help: "",
    note: "",
    ...partial,
    type: "IMAGE",
    id: getId(partial, keepId),
  };
}

function createAudioElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "AUDIO" } & ApiCLAudioContext {
  return {
    text: "",
    help: "",
    note: "",
    ...partial,
    type: "AUDIO",
    id: getId(partial, keepId),
  };
}

function createSeparatorElement(
  partial: Partial<ApiCLSectionContextElementsInner> = {},
  keepId = false,
): { type: "SEPARATOR" } & ApiCLSeparatorContext {
  return {
    ...partial,
    type: "SEPARATOR",
    id: getId(partial, keepId),
  };
}

const typeCreatorMap: Partial<
  Record<
    ApiCLSectionContextElementsInner["type"],
    (
      partial?: Partial<ApiCLSectionContextElementsInner>,
      keepId?: boolean,
    ) => ApiCLSectionContextElementsInner
  >
> = {
  CHECKBOX: createCheckboxElement,
  MULTI_SELECT: createMultiselectElement,
  SINGLE_SELECT: createSingleSelectElement,
  TEXT: createTextElement,
  IMAGE: createImageElement,
  AUDIO: createAudioElement,
  SEPARATOR: createSeparatorElement,
};

export function createChecklistElement(
  type: ApiCLSectionContextElementsInner["type"],
  partial?: Partial<ApiCLSectionContextElementsInner>,
  keepId?: boolean,
): ApiCLSectionContextElementsInner {
  const creator = typeCreatorMap[type];

  if (!creator) {
    throw new Error(`Unknown checklist element type: ${type}`);
  }

  return creator(partial, keepId);
}

export function showPublishChecklistDefinitionDialog(
  openConfirmationDialog: (
    confirmationDialog: Omit<ConfirmationDialogProps, "open" | "onClose"> & {
      onClose?: ConfirmationDialogProps["onClose"];
    },
  ) => void,
  cldName: string,
  onConfirm: () => Promise<void> | void,
) {
  openConfirmationDialog({
    title: "Checklisten-Definition veröffentlichen?",
    description: `Möchten Sie den Entwurf „${cldName}” wirklich veröffentlichen? Danach sind keine Änderungen mehr möglich. Sie können jedoch weiterhin neue Versionen basierend auf diesem Entwurf erstellen.`,
    confirmLabel: "Veröffentlichen",
    cancelLabel: "Abbrechen",
    onConfirm: onConfirm,
  });
}

export function showDeleteChecklistDefinitionDialog(
  openConfirmationDialog: (
    confirmationDialog: Omit<ConfirmationDialogProps, "open" | "onClose"> & {
      onClose?: ConfirmationDialogProps["onClose"];
    },
  ) => void,
  cldName: string,
  onConfirm: () => Promise<void> | void,
) {
  openConfirmationDialog({
    title: "Checklisten-Definition-Entwurf löschen?",
    description: `Möchten Sie den Entwurf „${cldName}” wirklich löschen? Dies lässt sich nicht rückgängig machen.`,
    confirmLabel: "Löschen",
    cancelLabel: "Abbrechen",
    onConfirm: onConfirm,
    color: "danger",
  });
}

export function countTextModules(element: {
  textModuleFalse?: string;
  textModuleTrue?: string;
}) {
  return [element.textModuleFalse, element.textModuleTrue].filter((it) => it)
    .length;
}

export function getIsNewestVersion(cldVersion?: ApiChecklistDefinitionVersion) {
  return (
    cldVersion === undefined ||
    (cldVersion?.context.validTo === undefined &&
      cldVersion?.context.published === true)
  );
}

export function useUserCanSaveChecklistDefinition(
  cldVersion?: ApiChecklistDefinitionVersion,
) {
  const [canEditChecklists, canEditCoreChecklists] = useHasUserRolesCheck([
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  ]);

  if (!canEditChecklists) {
    return false;
  }

  if (cldVersion?.isCoreChecklist && !canEditCoreChecklists) {
    return false;
  }

  if (cldVersion === undefined) {
    return true;
  }

  if (!cldVersion?.context.published) {
    return true;
  }

  return getIsNewestVersion(cldVersion);
}
