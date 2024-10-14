/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/joy";

import { notEmptyFieldValidation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function MainQuestion(
  props: Readonly<{
    elementDataFormikPath: string;
    sectionElementDeleteHandler: () => void;
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
        name={`${props.elementDataFormikPath}.questionText`}
        placeholder="Frage eingeben"
        sx={{ flex: 1 }}
        validate={notEmptyFieldValidation}
        data-testid="mainQuestionTitle"
      />

      <Stack direction="row" spacing={1} alignItems="center" paddingTop={"6px"}>
        <Box>{"Antwortmöglichkeiten: "}</Box>
        <RadioGroup>
          <List
            sx={{
              "--ListItem-radius": "8px",
              "--List-gap": "1rem",
            }}
            orientation="horizontal"
          >
            <ListItem sx={{ backgroundColor: "white", padding: 0.6 }}>
              <Radio disabled={true} value="Ja" label="Ja" />
            </ListItem>
            <ListItem sx={{ backgroundColor: "white", padding: 0.6 }}>
              <Radio disabled={true} value="Nein" label="Nein" />
            </ListItem>
          </List>
        </RadioGroup>
      </Stack>

      <Stack alignItems="center" paddingTop={"6px"}>
        <IconButton
          onClick={props.sectionElementDeleteHandler}
          aria-label="Entfernen"
          color="warning"
          variant="outlined"
          title="Frageblock löschen"
          data-testid="deleteQuestion"
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
