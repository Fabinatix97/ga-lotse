/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { Button, Radio } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { PropsWithChildren } from "react";

import {
  RadioGroupField,
  RadioGroupFieldProps,
} from "@/lib/shared/components/formFields/RadioGroupField";

function hasProperty<K extends string>(
  obj: unknown,
  prop: K,
): obj is Record<K, unknown> {
  return obj != null && typeof obj === "object" && prop in obj;
}

type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${Path<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

type SelectPath<T, K extends string> = T extends object
  ? K extends `${infer F}.${infer R}`
    ? SelectPath<Idx<T, F>, R>
    : Idx<T, K>
  : never;
type Idx<T, K extends string> = K extends keyof T ? T[K] : never;

class ObjectUndefinedError extends Error {}
class PropNotDefinedError extends Error {}
function selectPath<T, K extends string>(
  object: T,
  propSelector: K,
): SelectPath<T, K> {
  if (object == null || typeof object !== "object") {
    throw new ObjectUndefinedError();
  }
  const [first, ...rest] = propSelector.split(".");
  if (first == null || !hasProperty(object, first)) {
    if (rest.length === 0) {
      return undefined as SelectPath<T, K>;
    }
    throw new PropNotDefinedError();
  }
  const value = object[first];
  if (!rest || rest.length === 0) {
    return value as SelectPath<T, K>;
  }
  try {
    return selectPath(value, rest.join("."));
  } catch (e) {
    if (e instanceof ObjectUndefinedError) {
      throw Error(`Object is undefined ${JSON.stringify(object)}`);
    }
    if (e instanceof PropNotDefinedError) {
      throw Error(`Object doesn't contain selector ${propSelector}`);
    }
    throw Error("Unknown Error!");
  }
}

export interface YesOrNoWithFollowUpProps<T>
  extends PropsWithChildren<Omit<RadioGroupFieldProps, "name" | "label">> {
  name: Path<T> | string;
  label: string;
  sx?: SxProps;
  labelTrue?: string;
  labelFalse?: string;
}

export function YesOrNoWithFollowUp<T>({
  children,
  sx,
  ...radioProps
}: YesOrNoWithFollowUpProps<T>) {
  const { values, getFieldHelpers } = useFormikContext<T>();
  const { setValue } = getFieldHelpers(radioProps.name);
  const value = selectPath(values, radioProps.name);

  return (
    <Row
      sx={{
        justifyContent: "space-between",
        border: "none",
        padding: 0,
        ...sx,
      }}
      component="fieldset"
      aria-label={radioProps.label}
    >
      <Row>
        <RadioGroupField {...radioProps} orientation="horizontal">
          <Radio
            name={radioProps.name}
            value={"yes"}
            label={radioProps.labelTrue ?? "Ja"}
          />
          <Radio
            name={radioProps.name}
            value={"no"}
            label={radioProps.labelFalse ?? "Nein"}
          />
          {value ? (
            <Button
              variant="plain"
              size="sm"
              sx={{
                marginLeft: 1,
                marginTop: "-0.375rem",
                marginBottom: "-0.375rem",
                fontWeight: 400,
              }}
              onClick={() => setValue(null)}
            >
              Zurücksetzen
            </Button>
          ) : undefined}
        </RadioGroupField>
      </Row>
      {value === "yes" ? children : undefined}
    </Row>
  );
}

export type YesOrNoFieldData = "yes" | "no" | null;

export function mapYesOrNoToBool(
  b: YesOrNoFieldData | "",
): boolean | undefined {
  if (b == null || b == "") {
    return;
  }
  return b === "yes";
}

export function mapBoolToYesOrNo(
  b: boolean | null | undefined,
): YesOrNoFieldData {
  if (b == null) {
    return null;
  }
  return b ? "yes" : "no";
}
