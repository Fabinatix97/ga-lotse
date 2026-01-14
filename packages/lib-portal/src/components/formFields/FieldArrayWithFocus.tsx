/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FieldArray,
  FieldArrayConfig,
  FieldArrayRenderProps,
  isEmptyChildren,
} from "formik";
import {
  Children,
  ReactNode,
  createElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { isDefined } from "remeda";

export type FieldArrayRenderExtendedProps = FieldArrayRenderProps & {
  /**
   * this ref needs to be set directly on Input input, use `slotProps`.
   * See `YearField` and `MemoizedInputField` for example
   */
  setInputElementRef: (element: HTMLElement, index: number) => void;
  setFallbackElementRef: (element: HTMLElement | null) => void;
};

interface FieldArrayWithFocusProps
  extends Omit<FieldArrayConfig, "children" | "render"> {
  valueLength: number;
  children?: (props: FieldArrayRenderExtendedProps) => ReactNode;
  render?: (props: FieldArrayRenderExtendedProps) => ReactNode;
  fallbackFocusInputElement?: HTMLElement;
}

export function FieldArrayWithFocus({
  valueLength,
  children,
  component,
  render,
  fallbackFocusInputElement,
  ...fieldArrayProps
}: FieldArrayWithFocusProps) {
  const [actionFlag, setActionFlag] = useState<
    | {
        action: "delete" | "add";
        onIndex: number;
      }
    | undefined
  >(undefined);
  const inputElements = useRef<HTMLElement[]>([]);
  const fallbackElement = useRef<HTMLElement | null>(fallbackFocusInputElement);

  useEffect(() => {
    if (fallbackFocusInputElement) {
      fallbackElement.current = fallbackFocusInputElement;
    }
  }, [fallbackFocusInputElement]);

  useEffect(() => {
    function focusNthElement(index: number) {
      (inputElements.current.at(index) ?? fallbackElement.current)?.focus();
    }

    if (isDefined(actionFlag)) {
      if (actionFlag.action === "add") {
        // if an element is added, focus the newly created last element
        focusNthElement(actionFlag.onIndex);
        setActionFlag(undefined);
      } else {
        // if an element is removed, focus the next (or last) element
        const removedIndex = actionFlag.onIndex;
        focusNthElement(
          removedIndex === valueLength ? removedIndex - 1 : removedIndex,
        );
        setActionFlag(undefined);
      }
    }
  }, [actionFlag, fallbackFocusInputElement, valueLength]);

  return (
    <FieldArray {...fieldArrayProps}>
      {(props) => {
        function remove<X>(index: number): X | undefined {
          setActionFlag({ action: "delete", onIndex: index });
          inputElements.current.splice(index, 1);
          return props.remove(index);
        }

        function push<X>(obj: X) {
          setActionFlag({
            action: "add",
            onIndex: valueLength,
          });
          props.push(obj);
        }

        const newProps = {
          ...props,
          remove,
          push,
          setInputElementRef: (el: HTMLElement, index: number) =>
            (inputElements.current[index] = el),
          setFallbackElementRef: (el: HTMLElement | null) =>
            (fallbackElement.current = el),
        };

        if (isDefined(component)) {
          // It is written like this in the original file
          // https://github.com/jaredpalmer/formik/blob/main/packages/formik/src/FieldArray.tsx#L379
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          return createElement(component as any, newProps);
        }
        if (isDefined(render)) {
          return render(newProps);
        }
        if (isDefined(children)) {
          if (typeof children === "function") {
            return children(newProps);
          } else if (!isEmptyChildren(children)) {
            return Children.only(children);
          }
        }
        return null;
      }}
    </FieldArray>
  );
}
