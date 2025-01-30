/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { Check } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
  styled,
} from "@mui/joy";
import { useTransition } from "react";

import { AddTextTemplate } from "@/lib/shared/components/icons/AddTextTemplate";

import { useTextTemplatesSidebar } from "./TextTemplatesSidebarProvider";

export function TextTemplateAccordion({
  name,
  text,
  index,
}: {
  name: string;
  text: string;
  index: number;
}) {
  return (
    <Accordion
      component="section"
      aria-label={name}
      sx={{ gap: 1, padding: 0 }}
    >
      <Row>
        <AccordionSummary
          sx={(theme) => ({ flex: 1, font: theme.typography["title-md"] })}
          slotProps={{
            button: {
              sx: { flexDirection: "row-reverse", justifyContent: "start" },
            },
          }}
        >
          {name}
        </AccordionSummary>
        <AddTextTemplateButton text={text} index={index} />
      </Row>
      <AccordionDetails>
        <Typography padding={2}>{text}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 300ms",
  "&[aria-disabled=true]": {
    "background-color": theme.palette.success.plainActiveBg,
    borderColor: "transparent",
    cursor: "default",
    ".MuiSvgIcon-root": { color: theme.palette.success.outlinedColor },
  },
}));

function AddTextTemplateButton({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  const [isAppending, startAppending] = useTransition();
  const { appendText } = useTextTemplatesSidebar();

  function onClick() {
    if (isAppending) {
      return;
    }
    startAppending(async () => {
      await Promise.all([appendText(text), wait(2000)]);
    });
  }
  const shortcut = index < 9 ? `${index + 1}` : undefined;

  return (
    <AnimatedIconButton
      aria-keyshortcuts={`${shortcut}`}
      variant={"outlined"}
      aria-disabled={isAppending}
      title={`Vorlage einfügen${shortcut ? ` (${shortcut})` : ""}`}
      sx={{ alignSelf: "start" }}
      onClick={onClick}
    >
      {isAppending ? <Check /> : <AddTextTemplate />}
    </AnimatedIconButton>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
