/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, List, ListItem, Typography, styled } from "@mui/joy";

import {
  ApiCLFieldOptionContext,
  ApiCLMultiSelectContext,
} from "@eshg/inspection-api";

import { ReadOnlyCLDElementProps } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/ReadOnlyCLDElement";
import {
  ReadOnlyCLDElementCheckboxTextModule,
  ReadOnlyCLDElementTextModule,
} from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementTextModule";
import { ReadOnlyCLDElementWrapper } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementWrapper";

export function ReadOnlyCLDElementMultiSelect(
  props: Readonly<ReadOnlyCLDElementProps<ApiCLMultiSelectContext>>,
) {
  const { element, sectionIndex, elementIndex } = props;
  return (
    <ReadOnlyCLDElementWrapper {...props}>
      <List sx={{ rowGap: 2 }} aria-label="Antwortmöglichkeiten">
        {element.items?.map((option) => (
          <FieldOption
            key={option.id}
            option={option}
            type={element.type}
            elementTitle={`${sectionIndex + 1}.${elementIndex + 1}.`}
          />
        ))}
      </List>
    </ReadOnlyCLDElementWrapper>
  );
}

function FieldOption({
  option,
  type,
  elementTitle,
}: Readonly<{
  option: ApiCLFieldOptionContext;
  type: string;
  elementTitle: string;
}>) {
  const OptionSymbol =
    type === "MULTI_SELECT" ? CheckboxOptionSymbol : RadioOptionSymbol;
  const TextModuleComponent =
    type === "CHECKBOX"
      ? ReadOnlyCLDElementCheckboxTextModule
      : ReadOnlyCLDElementTextModule;

  return (
    <ListItem sx={{ p: 0 }} aria-labelledby={`${option.id}-input`}>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: "auto 1fr",
          width: "100%",
        }}
      >
        <OptionSymbol />
        <Typography
          id={`${option.id}-input`}
          component="label"
          aria-label="Antwort"
        >
          {option.text}
        </Typography>
        <TextModuleComponent
          {...option}
          elementTitle={elementTitle}
          sx={{ gridColumnStart: 2 }}
        />
      </Box>
    </ListItem>
  );
}

const OptionSymbol = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.neutral.outlinedBorder}`,
  width: "1.25rem",
  height: "1.25rem",
  // align with first line of text
  marginTop: "0.1rem",
  display: "flex",
}));

const CheckboxOptionSymbol = styled(OptionSymbol)({
  borderRadius: "0.25rem",
});

const RadioOptionSymbol = styled(OptionSymbol)({
  borderRadius: "1.25rem",
});
