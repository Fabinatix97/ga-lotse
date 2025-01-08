/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  styled,
} from "@mui/joy";

import { notEmptyFieldValidation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function MainQuestion(
  props: Readonly<{
    elementDataFormikPath: string;
    sectionElementDeleteHandler: () => void;
    label: string;
  }>,
) {
  return (
    <Stack
      direction="row"
      spacing={5}
      alignItems="flex-start"
      flexWrap={"wrap"}
    >
      <InputField
        label
        aria-label={props.label}
        name={`${props.elementDataFormikPath}.questionText`}
        placeholder="Frage eingeben"
        sx={{ flex: 1 }}
        validate={notEmptyFieldValidation}
        data-testid="element-main-text"
      />

      <Stack direction="row" spacing={1} alignItems="center" paddingTop={"6px"}>
        <Box>{"Antwortmöglichkeiten: "}</Box>
        <List
          sx={{
            "--ListItem-radius": "8px",
            "--List-gap": "1rem",
          }}
          orientation="horizontal"
        >
          <ListItem sx={{ backgroundColor: "white", padding: 0.6 }}>
            <ReadOnlyRadio>Ja</ReadOnlyRadio>
          </ListItem>
          <ListItem sx={{ backgroundColor: "white", padding: 0.6 }}>
            <ReadOnlyRadio>Nein</ReadOnlyRadio>
          </ListItem>
        </List>
      </Stack>

      <Stack alignItems="center" paddingTop={"6px"}>
        <IconButton
          onClick={props.sectionElementDeleteHandler}
          aria-label="Entfernen"
          color="warning"
          variant="outlined"
          title="Entfernen"
          data-testid="element-delete-button"
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

const ReadOnlyRadio = styled(Typography)(({ theme }) => ({
  color: theme.palette.neutral.solidDisabledColor,
  display: "flex",
  // use a before pseudo-element that looks like a radiobutton
  "::before": {
    content: '""',
    border: `1px solid ${theme.palette.neutral.outlinedDisabledBorder}`,
    width: "1.25rem",
    height: "1.25rem",
    marginRight: "0.5rem",
    // align with first line of text
    marginTop: "0.1rem",
    borderRadius: "1.25rem",
  },
}));
