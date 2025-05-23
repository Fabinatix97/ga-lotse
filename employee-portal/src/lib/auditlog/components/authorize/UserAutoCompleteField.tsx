/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Close, Search } from "@mui/icons-material";
import {
  AutocompleteOption,
  Chip,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { FormikErrors } from "formik";
import { useId } from "react";

import { ApiUser } from "@eshg/base-api";
import { CustomAutocomplete, formatUserName } from "@eshg/lib-portal";

import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";

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
  const iconId = useId();

  return (
    <CustomAutocomplete
      name="users"
      startDecorator={<Search />}
      color="primary"
      multiple
      options={options}
      value={values}
      getOptionLabel={(user) => formatUserName(user)}
      renderTags={(users, getTagProps) =>
        users.map((user, index) => (
          // key handled by mui getTagProps
          // eslint-disable-next-line react/jsx-key
          <Chip
            variant="soft"
            color="primary"
            endDecorator={
              <Close id={iconId} fontSize="sm" aria-label="Auswahl entfernen" />
            }
            sx={{ minWidth: 0 }}
            {...getTagProps({ index })}
            slotProps={{
              action: {
                "aria-describedby": iconId,
              },
            }}
          >
            {formatUserName(user)}
          </Chip>
        ))
      }
      renderOption={(props, user) => (
        <AutocompleteOption {...props}>
          <UserOption user={user} />
        </AutocompleteOption>
      )}
      onChange={(e, value) => setFieldValue("users", value)}
    />
  );
}

function UserOption({ user }: { user: ApiUser }) {
  return (
    <>
      <ListItemDecorator>
        <UserAvatar size="sm" user={user} />
      </ListItemDecorator>
      <ListItemContent>
        <Typography level="title-md">{formatUserName(user)}</Typography>
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
        <Typography mb={2} color="danger" fontSize="small">
          Bitte mindestens einen User auswählen.
        </Typography>
      )}
    </Stack>
  );
}
