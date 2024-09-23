/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Autocomplete,
  AutocompleteOption,
  Avatar,
  Box,
  Chip,
  ChipDelete,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/joy";
import { useField } from "formik";
import { HTMLAttributes } from "react";

import { ApiUser } from "@/lib/businessModules/chat/shared/types";

interface UsersAutocompleteProps {
  name: string;
  label: string;
  usersList: ApiUser[];
  multiple: boolean;
  getImageUrl: (url?: string) => string | null;
}

export function UsersAutocomplete({
  name,
  label,
  usersList,
  multiple,
  getImageUrl,
}: Readonly<UsersAutocompleteProps>) {
  const [field, meta, helpers] = useField<string | string[] | null>(name);
  return (
    <Box>
      <FormLabel htmlFor={name} sx={{ mt: 2 }}>
        {label}
      </FormLabel>
      <Autocomplete
        name="invite"
        multiple={multiple}
        value={field.value}
        onChange={async (_, newValue) => {
          if (multiple) {
            const emptyValue: string[] = [];
            await helpers.setValue(newValue ?? emptyValue);
          } else {
            await helpers.setValue(newValue);
          }
        }}
        options={usersList.map((opt) => opt.user_id)}
        getOptionLabel={(value) =>
          usersList?.find((apiUser) => apiUser.user_id === value)
            ?.display_name ?? value
        }
        renderOption={(props, option) => {
          const apiUser = usersList?.find((user) => user.user_id === option);
          if (!apiUser) return null;

          // eslint-disable-next-line unused-imports/no-unused-vars
          const { key, ...componentProps } = props as {
            key: string;
          } & Omit<HTMLAttributes<HTMLLIElement>, "color">;
          return (
            <AutocompleteOption
              key={option}
              {...componentProps}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  color="primary"
                  variant="soft"
                  size="sm"
                  src={getImageUrl(apiUser?.avatar_url) ?? undefined}
                />
                <Typography level="body-sm">{apiUser.display_name}</Typography>
              </Box>
              <Typography level="body-xs">{apiUser.user_id}</Typography>
            </AutocompleteOption>
          );
        }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            const apiUser = usersList?.find(
              (apiUser) => apiUser.user_id === option,
            );
            return (
              <Chip
                variant="outlined"
                key={key}
                endDecorator={<ChipDelete {...tagProps} />}
              >
                {apiUser?.display_name}
              </Chip>
            );
          })
        }
      />
      {meta.error && (
        <FormHelperText
          sx={{
            color: (theme) => theme.palette.danger[500],
            marginLeft: 0,
          }}
        >
          {meta.error}
        </FormHelperText>
      )}
    </Box>
  );
}
