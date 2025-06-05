/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikState } from "formik";
import { isNullish, isPlainObject } from "remeda";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import {
  ApiAppointmentType,
  ApiConcern,
  ApiStiProtectionProcedure,
  ApiStiProtectionProcedureOverview,
} from "@eshg/sti-protection-api";

export function concernToAppointmentType(
  concern: ApiConcern | "RESULTS_REVIEW",
): ApiAppointmentType {
  switch (concern) {
    case ApiConcern.HivStiConsultation:
      return ApiAppointmentType.HivStiConsultation;
    case ApiConcern.SexWork:
      return ApiAppointmentType.SexWork;
    case "RESULTS_REVIEW":
      return ApiAppointmentType.ResultsReview;
  }
}

export function getPropertyIf<T>(
  obj: unknown,
  prop: string,
  predicate: (v: unknown) => v is T,
): T | undefined {
  if (!isPlainObject(obj) || !(prop in obj)) {
    return;
  }
  const value = obj[prop];
  if (!predicate(value)) {
    return;
  }
  return value;
}

export function mapOptional<T, K>(
  val: T | undefined | null,
  predicate: (t: T) => K,
): K | undefined {
  if (val === undefined || val === null) {
    return;
  }
  return predicate(val);
}

export function optionalInt(num: string | undefined): number | undefined {
  if (num === undefined) {
    return;
  }
  const parsed = parseInt(num, 10);
  return !isNaN(parsed) ? parsed : undefined;
}

type NoUndefined<T> = T extends object
  ? {
      [K in keyof T]: Exclude<T[K], undefined>;
    }
  : never;
export function deleteUndefined<T extends object>(obj: T): NoUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_key, value]) => value !== undefined),
  ) as NoUndefined<T>;
}

export function isProcedureOpen(
  procedure: ApiStiProtectionProcedure | ApiStiProtectionProcedureOverview,
) {
  return procedure.status !== "CLOSED";
}

export function createOnlyIfProcedureOpen(
  procedure: ApiStiProtectionProcedure | ApiStiProtectionProcedureOverview,
) {
  const isOpen = isProcedureOpen(procedure);
  return function onlyIfOpen<T>(t: T) {
    if (!isOpen) {
      return;
    }
    return t;
  };
}

export function guardValue<T>(
  guard: boolean | null | undefined,
  value: T,
): T | undefined {
  return guard ? value : undefined;
}

export function areAllValuesUndefined(obj: unknown): boolean {
  return (
    isNullish(obj) || Object.values(obj).every((value) => value === undefined)
  );
}

export function useOnCancelForm<T>() {
  const { openCancelDialog } = useConfirmationDialog();

  return function onCancelForm({
    dirty,
    onConfirm,
    reset,
  }: {
    dirty: boolean;
    onConfirm?: () => void;
    reset: (state?: Partial<FormikState<T>>) => void;
  }) {
    if (!dirty) {
      return;
    }

    return openCancelDialog({
      onConfirm: () => {
        reset();
        if (onConfirm) onConfirm();
      },
    });
  };
}
