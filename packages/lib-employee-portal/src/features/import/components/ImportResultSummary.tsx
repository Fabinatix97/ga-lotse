/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  InfoOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemDecorator,
  Typography,
  styled,
} from "@mui/joy";

const StyledList = styled(List)(({ theme }) => ({
  "--List-padding": theme.spacing(2),
  "--List-gap": theme.spacing(4),
  "--List-radius": theme.vars.radius.lg,
  "--ListItem-paddingX": 0,
  "--ListItem-paddingY": 0,
}));

function renderIcon(type: ListItemType) {
  switch (type) {
    case "info":
      return <InfoOutlined color="primary" />;
    case "success":
      return <CheckCircleOutlined color="success" />;
    case "warning":
      return <WarningAmberOutlined color="warning" />;
    case "error":
      return <ErrorOutlineOutlined color="danger" />;
  }
}

export interface ImportResultItem {
  type: ListItemType;
  value: string;
}

type ListItemType = "info" | "success" | "warning" | "error";

interface ImportResultSummaryProps {
  items: ImportResultItem[];
}

export function ImportResultSummary(props: ImportResultSummaryProps) {
  return (
    <StyledList variant="soft" aria-label="Statistiken">
      {props.items.map((item, index) => (
        <ListItem key={index}>
          <ListItemDecorator>{renderIcon(item.type)}</ListItemDecorator>
          <Typography fontWeight="bold">{item.value}</Typography>
        </ListItem>
      ))}
    </StyledList>
  );
}
