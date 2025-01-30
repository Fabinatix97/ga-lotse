/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { TextTemplatesSidebar } from "./TextTemplatesSidebar";
import { ApiTextTemplateContext } from "./constants";
import { UseFieldHandle } from "./useFieldHandle";

const TextTemplatesContext = createContext<
  TextTemplatesSidebarContext | undefined
>(undefined);

export function TextTemplatesSidebarProvider({ children }: PropsWithChildren) {
  const [context, setContext] = useState<ApiTextTemplateContext | null>(null);
  const [fieldHandleRef, setFieldHandleRef] = useState<FieldHandleRef>();

  function open(
    context: ApiTextTemplateContext,
    setFieldValue: FieldHandleRef,
  ) {
    setContext(context);
    setFieldHandleRef(setFieldValue);
  }
  function close() {
    fieldHandleRef?.current?.finishEditing();
    setContext(null);
    setFieldHandleRef(undefined);
  }
  async function appendText(text: string) {
    if (fieldHandleRef?.current == null) {
      throw Error("No referenced TextArea to append to");
    }
    await fieldHandleRef.current.appendText(text);
  }

  return (
    <TextTemplatesContext.Provider
      value={{
        context,
        setContext,
        open,
        close,
        isOpen: context != null,
        appendText,
      }}
    >
      {children}
      <TextTemplatesSidebar />
    </TextTemplatesContext.Provider>
  );
}
type FieldSetter = (text: string) => Promise<void>;
type FieldHandleRef = MutableRefObject<UseFieldHandle | null>;
export interface TextTemplatesSidebarContext {
  isOpen: boolean;
  context: ApiTextTemplateContext | null;
  setContext: (context: ApiTextTemplateContext | null) => void;
  open: (
    context: ApiTextTemplateContext,
    setFieldValue: FieldHandleRef,
  ) => void;
  close: () => void;
  appendText: FieldSetter;
}

export function useTextTemplatesSidebar() {
  const context = useContext(TextTemplatesContext);
  if (!context) {
    throw Error("No TextTemplatesProvider found.");
  }
  return context;
}
