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
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createElement,
  useCallback,
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

interface FieldArrayWithFocusProps extends Omit<
  FieldArrayConfig,
  "children" | "render"
> {
  valueLength: number;
  children?: (props: FieldArrayRenderExtendedProps) => ReactNode;
  render?: (props: FieldArrayRenderExtendedProps) => ReactNode;
  fallbackFocusInputElement?: HTMLElement;
}

interface ActionFlag {
  action: "delete" | "add";
  onIndex: number;
}

export function FieldArrayWithFocus({
  valueLength,
  children,
  component,
  render,
  fallbackFocusInputElement,
  ...fieldArrayProps
}: FieldArrayWithFocusProps) {
  const [actionFlag, setActionFlag] = useState<ActionFlag | undefined>(
    undefined,
  );
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
      {(props) => (
        <InnerFieldArrayWithFocus
          {...props}
          setActionFlag={setActionFlag}
          inputElements={inputElements}
          valueLength={valueLength}
          fallbackElement={fallbackElement}
          component={component}
          render={render}
        >
          {children}
        </InnerFieldArrayWithFocus>
      )}
    </FieldArray>
  );
}

function InnerFieldArrayWithFocus({
  setActionFlag,
  inputElements,
  valueLength,
  fallbackElement,
  component,
  render,
  children,
  remove: propsRemove,
  push: propsPush,
  ...props
}: FieldArrayRenderProps & {
  setActionFlag: Dispatch<SetStateAction<ActionFlag | undefined>>;
  inputElements: RefObject<HTMLElement[]>;
  valueLength: number;
  fallbackElement: RefObject<HTMLElement | null | undefined>;
  component: FieldArrayWithFocusProps["component"];
  render: FieldArrayWithFocusProps["render"];
  children: FieldArrayWithFocusProps["children"];
}) {
  const remove = useCallback(
    function <X>(index: number): X | undefined {
      setActionFlag({ action: "delete", onIndex: index });
      inputElements.current.splice(index, 1);
      return propsRemove(index);
    },
    [setActionFlag, inputElements, propsRemove],
  );

  const push = useCallback(
    function <X>(obj: X) {
      setActionFlag({
        action: "add",
        onIndex: valueLength,
      });
      propsPush(obj);
    },
    [setActionFlag, valueLength, propsPush],
  );

  const setInputElementRef = useCallback(
    (el: HTMLElement, index: number) => (inputElements.current[index] = el),
    [inputElements],
  );

  const setFallbackElementRef = useCallback(
    (el: HTMLElement | null) => (fallbackElement.current = el),
    [fallbackElement],
  );

  const newProps = {
    ...props,
    remove,
    push,
    setInputElementRef,
    setFallbackElementRef,
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
}
