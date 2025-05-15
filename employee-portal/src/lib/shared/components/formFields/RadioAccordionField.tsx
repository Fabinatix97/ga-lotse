/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  Box,
  Radio,
  Sheet,
  Stack,
  radioClasses,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useField } from "formik";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  RadioGroupField,
  RadioGroupFieldProps,
} from "@eshg/lib-portal/components/formFields/RadioGroupField";

const RadioAccordionContext = createContext<{
  groupName: string;
}>({ groupName: "" });

// A group of Radio Buttons that can be expanded like an Accordion.
export function RadioAccordionGroupField({
  children,
  ...props
}: RadioGroupFieldProps) {
  // just Wraps RadioGroupField to provide extra context to RadioAccordionItem
  //  (so you don't have to pass the group name manually)
  return (
    <RadioGroupField {...props}>
      <RadioAccordionContext value={{ groupName: props.name }}>
        <Stack gap={2}>{children}</Stack>
      </RadioAccordionContext>
    </RadioGroupField>
  );
}

// A Radio Button in the shape of a Card that expands like an Accordion when selected
export function RadioAccordionItem({
  value,
  label,
  disabled,
  sx,
  children,
}: Readonly<{
  value: unknown;
  label: string;
  disabled?: boolean;
  sx?: SxProps;
  // The expanded state passed to the children can be used to deactivate form fields.
  children?: ((isExpanded: boolean) => ReactNode) | ReactNode;
}>) {
  const { groupName } = useContext(RadioAccordionContext);
  const [field] = useField<unknown>(groupName);
  const [isExpanded, setIsExpanded] = useState(true);

  // awful hack ahead
  //  isExpanded needs to be true on the first render
  //  otherwise AccordionDetails won't store inputs original tabindex
  useEffect(() => {
    setIsExpanded(field.value === value);
  }, [field.value, value]);

  // because accordion and radio get different id's by default
  //  we need to manage the id ourselves
  const id = useId();

  // AccordionDetails sets the tabindex of all focusable elements to -1 when collapsed.
  //  It should also restore the previous tabindex when expanded.
  //  This however does not work for some reason... so we have to do it ourselves.
  //  See: https://github.com/mui/material-ui/blob/afd551abd3be44de711d6baef48e62e18b97c908/packages/mui-joy/src/AccordionDetails/AccordionDetails.tsx#L100
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
      );

      elements.forEach((element) => {
        const prevTabIndex = element.getAttribute("data-prev-tabindex");

        if (isExpanded) {
          if (prevTabIndex === "unset") {
            element.removeAttribute("tabindex");
          } else if (prevTabIndex !== null) {
            element.setAttribute("tabindex", prevTabIndex);
          }
          element.removeAttribute("data-prev-tabindex");
        }
      });
    }
  }, [isExpanded]);

  return (
    <Sheet
      sx={{
        // based on our SelectableCard component
        display: "flex",
        alignItems: "center",
        borderRadius: "8px",
        padding: 0,
        borderColor: "a11y.neutral",
        [`:has([data-accordion-radio].${radioClasses.checked})`]: {
          backgroundColor: "primary.100",
          borderColor: "a11y.primary",
        },
        [`:has([data-accordion-radio].${radioClasses.disabled})`]: {
          backgroundColor: "whitesmoke",
          opacity: 0.75,
        },
        [`& [data-accordion-radio].${radioClasses.checked}`]: {
          [`& [data-accordion-radio].${radioClasses.radio}`]: {
            "--variant-outlinedBorder": "primary.400",
            "--variant-borderWidth": "2px",
          },
        },
        ...sx,
      }}
    >
      <AccordionGroup variant="plain">
        <Accordion expanded={isExpanded} sx={{ padding: 0 }}>
          <Box
            sx={{
              // prevents the radio button input from taking up the entire card
              position: "relative",
              padding: 2,
            }}
          >
            <Radio
              // extra data attribute to distinguish it from normal radios in the css above
              data-accordion-radio
              value={value}
              overlay
              variant="outlined"
              color="primary"
              sx={{ flexShrink: 0 }}
              label={label}
              id={`${id}-summary`}
              slotProps={{
                input: {
                  "aria-controls": `${id}-details`,
                  "aria-expanded": isExpanded,
                },
              }}
              disabled={disabled}
            />
          </Box>
          <AccordionDetails
            id={`${id}-details`}
            aria-labelledby={`${id}-summary`}
          >
            <Box
              ref={contentRef}
              sx={{
                // padding can't be applied to AccordionDetails directly
                //  because it would cause the container to grow even when collapsed
                padding: "0 16px 16px 48px",
                // unset variable set by accordion, so that children don't get messed up
                "--ListItem-marginInline": "0",
              }}
            >
              {typeof children === "function" ? children(isExpanded) : children}
            </Box>
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Sheet>
  );
}
