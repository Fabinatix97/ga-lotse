/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTextTemplateContext } from "@eshg/sti-protection-api";
import { Add } from "@mui/icons-material";
import { Button, styled } from "@mui/joy";
import { useFormikContext } from "formik";
import { KeyboardEvent, useRef } from "react";

import { FieldSetColumn } from "@/lib/shared/components/formFields/FieldSetControl";
import {
  TextareaField,
  TextareaFieldProps,
} from "@/lib/shared/components/formFields/TextareaField";

import { AppendText, TextTemplatesSidebar } from "./TextTemplatesSidebar";
import {
  appendText,
  nextInsertPoint,
  selectFirstPoint,
} from "./nextInsertPoint";
import { useSidebarFromSearchParam } from "./useSidebarFromSearchParam";

export interface TextareaWithTextTemplatesProps extends TextareaFieldProps {
  context: ApiTextTemplateContext;
}

export function TextareaFieldWithTextTemplates({
  context,
  ...props
}: TextareaWithTextTemplatesProps) {
  const { setFieldValue, getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta(props.name);

  const ref = useRef<HTMLTextAreaElement | null>(null);
  const appendTextRef = useRef<AppendText | null>(null);
  appendTextRef.current = async (text) => {
    await setFieldValue(props.name, appendText(text, value));
  };

  const { open } = useSidebarFromSearchParam({
    component: TextTemplatesSidebar,
    paramName: "text-template",
    paramValue: props.name,
    props: {
      context,
      appendTextRef,
    },
    afterClose() {
      selectFirstPoint(ref.current);
    },
    fallbackTitle: "Textvorlage einfügen",
  });

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (ref.current == null) {
      return;
    }
    let insertionPoint;
    if (e.code === "Space" && e.ctrlKey) {
      insertionPoint = nextInsertPoint(value, ref.current.selectionEnd ?? 0);
      if (insertionPoint == null) {
        open();
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
      <StyledTextarea
        {...props}
        slotProps={{ textarea: { ref, rows: 20, onKeyDownCapture: onKeyDown } }}
      />
      <Button
        startDecorator={<Add />}
        aria-keyshortcuts="Control+Space"
        variant="plain"
        onClick={open}
        title="Menü der Textvorlagen öffnen (Strg+Leertaste)"
      >
        Textvorlage einfügen
      </Button>
    </FieldSetColumn>
  );
}

const StyledTextarea = styled(TextareaField)(() => ({
  width: "100%",
}));
