/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNew } from "@mui/icons-material";
import {
  AccordionGroup,
  Button,
  Divider,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { SidebarActions, SidebarContent } from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";
import { ApiTextTemplateContext } from "@eshg/sti-protection-api";

import { useTextTemplates } from "@/lib/businessModules/stiProtection/api/queries/textTemplates";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

import { TextTemplateAccordion } from "./TextTemplateAccordion";
import { TextTemplateContextOptions } from "./constants";

export type AppendText = (text: string) => Promise<void> | undefined;
interface TextTemplatesSidebarProps {
  onClose: () => void;
  context: ApiTextTemplateContext;
  appendTextRef: MutableRefObject<AppendText | null>;
}

export function TextTemplatesSidebar({
  onClose,
  context,
  appendTextRef,
}: TextTemplatesSidebarProps) {
  const accordionsRef = useRef<HTMLDivElement | null>(null);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const index = parseInt(e.key);
    if (isNaN(index)) {
      return;
    }
    const button = accordionsRef.current?.querySelector(
      `button[aria-keyshortcuts="${index}"]`,
    ) as HTMLElement | undefined;
    button?.click();
  }, []);

  function appendText(text: string) {
    if (appendTextRef.current === null) {
      return;
    }
    return appendTextRef.current(text);
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <>
      <SidebarContent title="Textvorlage einfügen">
        <TextTemplatesSidebarContent
          context={context}
          appendText={appendText}
          accordionsRef={accordionsRef}
        />
      </SidebarContent>
      <SidebarActions>
        <Button sx={{ alignSelf: "end" }} onClick={onClose}>
          Schließen
        </Button>
      </SidebarActions>
    </>
  );
}
interface TextTemplatesSidebarContentProps
  extends Pick<TextTemplatesSidebarProps, "context"> {
  appendText: AppendText;
  accordionsRef: MutableRefObject<HTMLDivElement | null>;
}
function TextTemplatesSidebarContent({
  context: givenContext,
  appendText,
  accordionsRef,
}: TextTemplatesSidebarContentProps) {
  const [context, setContext] = useState<ApiTextTemplateContext | null>(
    givenContext,
  );
  const filterContexts = context === null ? undefined : [context];
  const { data: textTemplates } = useTextTemplates(filterContexts);
  return (
    <Stack gap={2}>
      <ContextSelect context={context} setContext={setContext} />
      <AccordionGroup ref={accordionsRef} sx={{ gap: 1 }}>
        <Divider />
        {textTemplates.map(({ name, content }, index) => (
          <TextTemplateAccordion
            key={index}
            name={name}
            content={content}
            index={index}
            appendText={appendText}
          />
        ))}
      </AccordionGroup>
      <InternalLinkButton
        href={routes.textTemplates}
        sx={{ alignSelf: "start" }}
        variant="plain"
        endDecorator={<OpenInNew />}
      >
        Textvorlagen verwalten
      </InternalLinkButton>
    </Stack>
  );
}

interface ContextSelectProps {
  context: ApiTextTemplateContext | null;
  setContext: (c: ApiTextTemplateContext | null) => void;
}
function ContextSelect({ context, setContext }: ContextSelectProps) {
  const buttonId = useId();
  const labelId = useId();
  return (
    <Stack gap={1}>
      <label id={labelId} htmlFor={buttonId}>
        Kontext auswählen
      </label>
      <Select
        slotProps={{ button: { id: buttonId, "aria-labelledby": labelId } }}
        value={context}
        onChange={(_e, newValue) => {
          if (!newValue) {
            return;
          }
          setContext(newValue);
        }}
      >
        {TextTemplateContextOptions.map((option, index) => (
          <Option key={index} label={option.label} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Stack>
  );
}
