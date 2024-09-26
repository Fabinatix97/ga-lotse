/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { Close, Search } from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteOption,
  Chip,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { FormikErrors } from "formik";

import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { fullName } from "@/lib/shared/components/users/userFormatter";

interface UserInputProps {
  options: ApiUser[];
  values: ApiUser[];
  setFieldValue: (
    field: string,
    value: ApiUser[],
  ) => Promise<void | FormikErrors<{ validForm: boolean; users: ApiUser[] }>>;
}

export function UserAutoCompleteField({
  options,
  values,
  setFieldValue,
}: UserInputProps) {
  return (
    <Autocomplete
      name="users"
      startDecorator={<Search />}
      color="primary"
      multiple
      options={options}
      value={values}
      onChange={(e, value) => setFieldValue("users", value)}
      getOptionLabel={(user) => fullName(user)}
      renderTags={(users, getTagProps) =>
        users.map((user, index) => (
          // key handled by mui getTagProps
          // eslint-disable-next-line react/jsx-key
          <Chip
            variant="soft"
            color="primary"
            endDecorator={<Close fontSize="sm" />}
            sx={{ minWidth: 0 }}
            {...getTagProps({ index })}
          >
            {fullName(user)}
          </Chip>
        ))
      }
      renderOption={(props, user) => (
        <AutocompleteOption {...props}>
          <UserOption user={user} />
        </AutocompleteOption>
      )}
    />
  );
}

function UserOption({ user }: { user: ApiUser }) {
  return (
    <>
      <ListItemDecorator>
        <UserAvatar size={"sm"} user={user} />
      </ListItemDecorator>
      <ListItemContent>
        <Typography level="title-md">{fullName(user)}</Typography>
        <Typography level={"body-sm"} textColor="text.secondary">
          Gesundheitsamt Frankfurt
        </Typography>
      </ListItemContent>
    </>
  );
}

export function ErrorHints({
  erroneous,
}: Readonly<{
  erroneous: boolean;
}>) {
  return (
    <Stack gap={0.5} mt={3}>
      {erroneous && (
        <Typography mb={2} color={"danger"} fontSize={"small"}>
          Bitte mindestens einen User auswählen.
        </Typography>
      )}
    </Stack>
  );
}
