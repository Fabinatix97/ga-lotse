/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormikErrors } from "formik";
import {
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { ApiChecklist } from "@eshg/inspection-api";

import {
  CLFormElement,
  validateAllChecklists,
} from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

interface ValidationErrors {
  elementId: string;
  element: RefObject<HTMLDivElement | null>;
  errors: FormikErrors<CLFormElement> | null;
}

interface RegisteredElementForm {
  validate: () => Promise<ValidationErrors>;
}

interface ChecklistValidateContext {
  registerElementForm: (form: RegisteredElementForm) => void;
  unregisterElementForm: (form: RegisteredElementForm) => void;
  validateAllVisibleForms: () => Promise<ValidationErrors | null>;
  validateAllModelValues: (checklists: ApiChecklist[]) => string | null;
  invalidElementIds: Map<string, string>;
  firstInvalidElementId: string | null;
}

const ChecklistValidateContext = createContext<ChecklistValidateContext>(null!);

/** tracks the validation state of all checklists */
export function ChecklistValidationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [forms, setForms] = useState<Set<RegisteredElementForm>>(
    new Set<RegisteredElementForm>(),
  );
  const [invalidElementIds, setInvalidElementIds] = useState<
    Map<string, string>
  >(new Map());
  const [firstInvalidElementId, setFirstInvalidElementId] = useState<
    string | null
  >(null);

  const registerElementForm = useCallback(
    (form: RegisteredElementForm) =>
      setForms((prev) => new Set<RegisteredElementForm>(prev).add(form)),
    [],
  );

  const unregisterElementForm = useCallback(
    (form: RegisteredElementForm) =>
      setForms((prev) => {
        const next = new Set<RegisteredElementForm>(prev);
        next.delete(form);
        return next;
      }),
    [],
  );

  async function validateAllVisibleForms() {
    // collect all registered validate functions
    const allValidateFunctions: Promise<ValidationErrors>[] = Array.from(
      forms,
    ).map((form) => form.validate());
    // call all registered validate function
    const allResults = await Promise.all(allValidateFunctions);
    // return first error, if any
    return allResults.find((result) => result.errors !== null) ?? null;
  }

  function validateAllModelValues(checklists: ApiChecklist[]) {
    setInvalidElementIds(new Map());
    setFirstInvalidElementId(null);
    const {
      invalidElementIds,
      firstInvalidElementId,
      firstInvalidChecklistId,
    } = validateAllChecklists(checklists);
    setInvalidElementIds(invalidElementIds);
    setFirstInvalidElementId(firstInvalidElementId);
    return firstInvalidChecklistId;
  }

  return (
    <ChecklistValidateContext
      value={{
        registerElementForm,
        unregisterElementForm,
        validateAllVisibleForms,
        validateAllModelValues,
        invalidElementIds,
        firstInvalidElementId,
      }}
    >
      {children}
    </ChecklistValidateContext>
  );
}

export function useChecklistValidateContext() {
  return useContext(ChecklistValidateContext);
}
