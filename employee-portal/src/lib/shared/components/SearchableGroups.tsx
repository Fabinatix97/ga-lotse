/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoSearchResults } from "@eshg/lib-employee-portal";
import {
  CloseOutlined,
  KeyboardArrowDown,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import { Fragment, ReactNode, useId, useState } from "react";
import { isNonNullish } from "remeda";

export interface SearchableGroupItem {
  key: string;
  searchableValue: string;
}

export interface SearchableGroup<
  TItem extends SearchableGroupItem = SearchableGroupItem,
> {
  name: string;
  inAccordion: boolean;
  items: TItem[];
}

export interface SearchableGroupsProps<
  TItem extends SearchableGroupItem = SearchableGroupItem,
> {
  groups: SearchableGroup<TItem>[];
  label?: string;
  placeholder?: string;
  hideSearch?: boolean;
  startExpanded?: boolean;
  renderItem: (item: TItem) => ReactNode;
}

export function SearchableGroups<
  TItem extends SearchableGroupItem = SearchableGroupItem,
>(props: SearchableGroupsProps<TItem>) {
  const showLabel = isNonNullish(props.label);
  const showSearch = !props.hideSearch;

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    props.startExpanded ? props.groups.map((group) => group.name) : [],
  );

  const filteredGroups = props.groups.map((group) => ({
    name: group.name,
    items: group.items.filter((value) =>
      value.searchableValue.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
    expanded: expandedGroups.includes(group.name) || searchTerm !== "",
    inAccordion: group.inAccordion,
  }));

  const zeroSearchResults =
    searchTerm !== "" &&
    filteredGroups.every((group) => group.items.length === 0);

  function toggleExpandedGroup(groupName: string) {
    setExpandedGroups((prevGroupNames) => {
      if (prevGroupNames.includes(groupName)) {
        return prevGroupNames.filter(
          (prevGroupName) => prevGroupName !== groupName,
        );
      } else {
        return [...prevGroupNames, groupName];
      }
    });
  }

  return (
    <Stack spacing={2}>
      {(showSearch || showLabel) && (
        <Stack spacing={1}>
          {showLabel && (
            <Typography level="h4" component="p">
              {props.label}
            </Typography>
          )}
          {showSearch && (
            <Input
              size="md"
              placeholder={props.placeholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              startDecorator={<SearchOutlined />}
              endDecorator={
                searchTerm !== "" && (
                  <IconButton
                    aria-label="Suchen"
                    onClick={() => setSearchTerm("")}
                  >
                    <CloseOutlined />
                  </IconButton>
                )
              }
            />
          )}
        </Stack>
      )}

      {zeroSearchResults ? (
        <NoSearchResults info="Keine Treffer" />
      ) : (
        <List
          sx={{
            "--List-padding": 0,
            gap: 2,
          }}
        >
          {filteredGroups
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <Group
                key={group.name}
                group={group}
                toggleExpandedGroup={toggleExpandedGroup}
                renderItem={props.renderItem}
              />
            ))}
        </List>
      )}
    </Stack>
  );
}

interface GroupProps<TItem extends SearchableGroupItem> {
  group: {
    name: string;
    items: TItem[];
    expanded: boolean;
    inAccordion: boolean;
  };
  toggleExpandedGroup: (name: string) => void;
  renderItem: (item: TItem) => ReactNode;
}

function Group<TItem extends SearchableGroupItem>(props: GroupProps<TItem>) {
  return props.group.inAccordion ? (
    <GroupAccordion {...props} />
  ) : (
    <GroupPlain {...props} />
  );
}

function GroupAccordion<TItem extends SearchableGroupItem>({
  group,
  toggleExpandedGroup,
  renderItem,
}: GroupProps<TItem>) {
  const buttonId = useId();
  const expandableContentId = useId();

  return (
    <ListItem
      nested
      variant="outlined"
      sx={{
        borderRadius: "md",
        backgroundColor: "background.surface",
      }}
    >
      <ListItemButton
        variant="plain"
        onClick={() => toggleExpandedGroup(group.name)}
        sx={{
          borderRadius: "md",
        }}
        id={buttonId}
        aria-expanded={group.expanded}
        aria-controls={expandableContentId}
      >
        <ListItemContent>
          <Typography
            component="span"
            level="title-md"
            fontWeight="md"
            sx={{
              overflowWrap: "break-word",
              hyphens: "auto",
            }}
          >
            {group.name}
          </Typography>
        </ListItemContent>
        <KeyboardArrowDown
          sx={{
            transform: group.expanded ? "rotate(180deg)" : "none",
          }}
        />
      </ListItemButton>
      <Box
        id={expandableContentId}
        aria-labelledby={buttonId}
        sx={{
          display: "grid",
          visibility: group.expanded ? "visible" : "hidden",
          gridTemplateRows: group.expanded ? "1fr" : "0fr",
          transition: "0.2s ease",
          "@media (prefers-reduced-motion)": {
            transition: "none",
          },
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        <List>
          {group.items.map((item) => {
            return (
              <ListItem
                key={item.key}
                sx={{
                  "&:first-of-type": {
                    paddingTop: 2,
                  },
                  "&:last-of-type": {
                    paddingBottom: 2,
                  },
                }}
              >
                {renderItem(item)}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </ListItem>
  );
}

function GroupPlain<TItem extends SearchableGroupItem>({
  group,
  renderItem,
}: GroupProps<TItem>) {
  return (
    <ListItem
      nested
      sx={{
        padding: 0,
      }}
    >
      <ListItemContent>
        <Typography
          component="span"
          level="body-sm"
          fontWeight="md"
          sx={{
            overflowWrap: "break-word",
            hyphens: "auto",
            paddingBottom: 0.5,
          }}
        >
          {group.name}
        </Typography>
        {group.items.map((item) => (
          <Fragment key={item.key}>{renderItem(item)}</Fragment>
        ))}
      </ListItemContent>
    </ListItem>
  );
}
