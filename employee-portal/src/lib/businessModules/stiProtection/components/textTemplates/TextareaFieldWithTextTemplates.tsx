/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useFormikContext } from "formik";
import { KeyboardEvent, useRef } from "react";

import { FieldSetColumn } from "@/lib/shared/components/formFields/FieldSetControl";
import {
  TextareaField,
  TextareaFieldProps,
} from "@/lib/shared/components/formFields/TextareaField";

import { useTextTemplatesSidebar } from "./TextTemplatesSidebarProvider";
import { ApiTextTemplateContext } from "./constants";
import {
  UseFieldHandle,
  nextInsertPoint,
  useFieldHandle,
} from "./useFieldHandle";

export interface TextareaWithTextTemplatesProps extends TextareaFieldProps {
  context: ApiTextTemplateContext;
}

export function TextareaFieldWithTextTemplates({
  context,
  ...props
}: TextareaWithTextTemplatesProps) {
  const { open } = useTextTemplatesSidebar();
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta(props.name);

  const ref = useRef<HTMLTextAreaElement | null>(null);
  const setterRef = useRef<UseFieldHandle | null>(null);
  setterRef.current = useFieldHandle({ name: props.name, ref });

  function setOpen() {
    open(context, setterRef);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (ref.current == null) {
      return;
    }
    let insertionPoint;
    if (e.code === "Space" && e.ctrlKey) {
      insertionPoint = nextInsertPoint(value, ref.current.selectionEnd ?? 0);
      if (insertionPoint == null) {
        setOpen();
      }
    } else if (e.code === "Enter" && e.ctrlKey) {
      insertionPoint =
        nextInsertPoint(value, ref.current.selectionEnd ?? 0) ??
        nextInsertPoint(value, 0);
    }

    if (insertionPoint == null) {
      return;
    }
    e.preventDefault();
    ref.current.selectionStart = insertionPoint.start;
    ref.current.selectionEnd = insertionPoint.end;
  }

  return (
    <FieldSetColumn gap={1} alignItems="start">
      <TextareaField
        {...props}
        slotProps={{ textarea: { ref, rows: 20, onKeyDownCapture: onKeyDown } }}
      />
      <Button
        startDecorator={<Add />}
        aria-keyshortcuts="Control+Space"
        variant="plain"
        onClick={setOpen}
        title="Textvorlage Menü Öffnen (Strg+Leertaste)"
      >
        Textvorlage einfügen
      </Button>
    </FieldSetColumn>
  );
}
