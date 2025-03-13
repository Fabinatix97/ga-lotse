/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  AutocompleteOption,
  Box,
  Chip,
  ChipDelete,
  FormHelperText,
  Typography,
} from "@mui/joy";
import { useField } from "formik";
import { HTMLAttributes } from "react";

import { ApiUser } from "@/lib/businessModules/chat/shared/types";

import { ChatAvatar } from "./ChatAvatar";

interface UsersAutocompleteProps {
  name: string;
  placeholder: string;
  usersList: (ApiUser & { department?: string })[];
  multiple: boolean;
}

export function UsersAutocomplete({
  name,
  placeholder,
  usersList,
  multiple,
}: Readonly<UsersAutocompleteProps>) {
  const [field, meta, helpers] = useField<string | string[] | null>(name);
  return (
    <Box>
      <Autocomplete
        name="invite"
        aria-description={multiple ? "Mehrfachauswahl möglich" : undefined}
        multiple={multiple}
        value={field.value}
        size="lg"
        onChange={async (_, newValue) => {
          if (multiple) {
            const emptyValue: string[] = [];
            await helpers.setValue(newValue ?? emptyValue);
          } else {
            await helpers.setValue(newValue);
          }
        }}
        placeholder={placeholder}
        options={usersList.map((opt) => opt.user_id)}
        getOptionLabel={(value) =>
          usersList?.find((apiUser) => apiUser.user_id === value)
            ?.display_name ?? value
        }
        startDecorator={<SearchIcon />}
        slotProps={{
          input: {
            sx: {
              "&::placeholder": {
                color: "primary.300",
              },
            },
          },
        }}
        sx={{
          ".MuiAutocomplete-popupIndicator": {
            display: "none",
          },
          backgroundColor: "background.surface",
          borderColor: "primary.300",
          minHeight: "3.25rem",
        }}
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
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                <ChatAvatar
                  name={apiUser.display_name}
                  userId={apiUser.user_id}
                  avatarUrl={apiUser.avatar_url ?? null}
                  size="sm"
                />
                <Typography level="title-md">{apiUser.display_name}</Typography>
              </Box>
              {apiUser.department && (
                <Typography
                  noWrap
                  level="body-md"
                  sx={{
                    color: "neutral.400",
                  }}
                >
                  {apiUser.department}
                </Typography>
              )}
              {apiUser.user_id && (
                <Typography
                  noWrap
                  level="body-md"
                  sx={{
                    color: "neutral.400",
                    textAlign: "right",
                    flex: {
                      xl: 1,
                    },
                  }}
                >
                  {apiUser.user_id}
                </Typography>
              )}
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
                variant="soft"
                key={key}
                endDecorator={<ChipDelete {...tagProps} />}
                color="primary"
              >
                {apiUser?.display_name}
              </Chip>
            );
          })
        }
      />
      <Box sx={{ minHeight: "1.25rem" }}>
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
    </Box>
  );
}
