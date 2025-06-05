/**
 * Copyright 2025 cronn GmbH
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
  setInputElementRef: (element: HTMLInputElement, index: number) => void;
};

interface FieldArrayWithFocusProps
  extends Omit<FieldArrayConfig, "children" | "render"> {
  valueLength: number;
  children?: (props: FieldArrayRenderExtendedProps) => ReactNode;
  render?: (props: FieldArrayRenderExtendedProps) => ReactNode;
}

export function FieldArrayWithFocus({
  valueLength,
  children,
  component,
  render,
  ...fieldArrayProps
}: FieldArrayWithFocusProps) {
  const [actionFlag, setActionFlag] = useState<
    | {
        action: "delete" | "add";
        onIndex: number;
      }
    | undefined
  >(undefined);
  const inputElements = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    function focusNthElement(index: number) {
      inputElements.current.at(index)?.focus();
    }

    if (isDefined(actionFlag)) {
      if (actionFlag.action === "add") {
        // if an element is added, focus the newly created last element
        focusNthElement(valueLength - 1);
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
  }, [actionFlag, valueLength]);

  return (
    <FieldArray {...fieldArrayProps}>
      {(props) => {
        function remove<X>(index: number): X | undefined {
          setActionFlag({ action: "delete", onIndex: index });
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
          setInputElementRef: (el: HTMLInputElement, index: number) =>
            (inputElements.current[index] = el),
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
