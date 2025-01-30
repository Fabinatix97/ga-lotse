/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { OpenInNew } from "@mui/icons-material";
import {
  AccordionGroup,
  Button,
  Divider,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import { KeyboardEvent, useId, useRef } from "react";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

import { TextTemplateAccordion } from "./TextTemplateAccordion";
import { useTextTemplatesSidebar } from "./TextTemplatesSidebarProvider";
import { ExampleTextTemplates, TextTemplateContextOptions } from "./constants";

export function TextTemplatesSidebar() {
  const { isOpen, close, context } = useTextTemplatesSidebar();
  const accordionsRef = useRef<HTMLDivElement | null>(null);

  const textTemplates = ExampleTextTemplates.filter(
    (k) => k.context === context,
  );

  function onKeyDown(e: KeyboardEvent) {
    const index = parseInt(e.key);
    if (isNaN(index)) {
      return;
    }
    const button = accordionsRef.current?.querySelector(
      `button[aria-keyshortcuts="${index}"]`,
    ) as HTMLElement | undefined;
    button?.click();
  }

  return (
    <div onKeyDown={onKeyDown}>
      <Sidebar open={isOpen} onClose={close}>
        <SidebarContent title={"Textvorlage einfügen"}>
          <Stack gap={2}>
            <ContextSelect />
            <AccordionGroup sx={{ gap: 1 }} ref={accordionsRef}>
              <Divider />
              {textTemplates.map(({ name, text }, index) => (
                <TextTemplateAccordion
                  key={name}
                  name={name}
                  text={text}
                  index={index}
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
        </SidebarContent>
        <SidebarActions>
          <Button onClick={close} sx={{ alignSelf: "end" }}>
            Schließen
          </Button>
        </SidebarActions>
      </Sidebar>
    </div>
  );
}

export function ContextSelect() {
  const { context, setContext } = useTextTemplatesSidebar();
  const buttonId = useId();
  const labelId = useId();
  return (
    <Stack gap={1}>
      <label id={labelId} htmlFor={buttonId}>
        Kontext auswählen
      </label>
      <Select
        slotProps={{ button: { id: buttonId, "aria-labelledby": labelId } }}
        value={context ?? null}
        onChange={(_e, newValue) => setContext(newValue)}
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
