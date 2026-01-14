/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useRef, useState } from "react";

import { ApiPacklist } from "@eshg/inspection-api";

interface PacklistProps {
  revisionName: string;
  packlist: ApiPacklist;
  handleCheck: (
    packlistId: string,
    packlistElementId: string,
    checked: boolean,
  ) => void;
  handleDeleteClick: (revisionId: string) => void;
  readonly?: boolean;
}

export function Packlist({
  revisionName,
  packlist,
  handleCheck,
  handleDeleteClick,
  readonly,
}: Readonly<PacklistProps>) {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (expanded) {
      accordionRef.current
        ?.querySelectorAll("input")
        .forEach((r) => (r.tabIndex = 0));
    }
  }, [expanded]);

  return (
    <AccordionGroup variant="plain" transition="0.5s">
      <Accordion
        ref={accordionRef}
        sx={{ p: 0 }}
        expanded={expanded}
        onChange={(event, expanded) => {
          setExpanded(expanded);
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Grid
            sx={(theme) => ({
              bgcolor: theme.palette.neutral.softBg,
              padding: theme.spacing(1),
              borderRadius: theme.radius.md,
              flexGrow: 1,
            })}
            alignItems="flex-start"
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Typography fontSize="md" fontWeight="400" sx={{ width: "60%" }}>
                {revisionName}
              </Typography>
              <Typography
                fontSize="md"
                fontWeight="400"
                sx={() => ({
                  bgcolor: "#E3EFFB",
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 1,
                  paddingRight: 1,
                  borderRadius: 24,
                  color: "#12467B",
                })}
              >
                {packlist.elements.filter((e) => e.isChecked).length}/
                {packlist.elements.length}
              </Typography>

              <AccordionSummary
                sx={{
                  minHeight: "1px",
                  height: "1px",
                  marginTop: -1.25,
                }}
                slotProps={{
                  button: {
                    "aria-label": "Abschnitt erweitern/einklappen",
                    sx: {
                      paddingTop: 0,
                      paddingBottom: 0,
                      margin: 0,
                      borderRadius: 0,
                      gap: 0,
                      "--variant-plainHoverBg": "transparent",
                      "--variant-plainActiveBg": "transparent",
                      "--Icon-color": "#0B6BCB",
                    },
                  },
                }}
              />
            </Stack>
            <AccordionDetails
              role={undefined}
              aria-label={`Fragen zu Abschnitt ${revisionName}`}
              slotProps={{
                root: {
                  "aria-labelledby": undefined,
                },
              }}
            >
              <Stack
                direction="column"
                gap={2}
                data-testid="packlists"
                sx={{
                  paddingX: 2,
                  marginTop: 2.5,
                  marginLeft: -1.5,
                }}
              >
                {packlist.elements.map((element) => {
                  return (
                    <Checkbox
                      key={element.id}
                      name={element.text}
                      label={element.text}
                      size="md"
                      variant="outlined"
                      checked={element.isChecked}
                      onChange={(ev) =>
                        handleCheck(packlist.id, element.id, ev.target.checked)
                      }
                    />
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Grid>
          {!readonly && (
            <IconButton
              aria-label="Löschen"
              variant="plain"
              color="danger"
              onClick={() => handleDeleteClick(packlist.revisionId)}
            >
              <DeleteOutlined />
            </IconButton>
          )}
        </Stack>
      </Accordion>
    </AccordionGroup>
  );
}
