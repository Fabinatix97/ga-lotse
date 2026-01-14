/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MarkdownPage } from "@/lib/baseModule/components/markdown/MarkdownPage";

const source = `
Only a minimal subset of markdown is supported. The following features are available:

## Heading level 2

### Heading level 3

- List item 1
- List item 2

This is a regular paragraph.

We have some strong **text**.

This is an [external link](https://stackoverflow.com).

We have a line  
break.

### Unsupported features

Some features are not supported.

- Some elements are rendered to html correctly, but are not styled. For example: other heading levels.
- Some elements are not rendered at all. For example images are not rendered.

# Heading level 1

#### Heading level 4

##### Heading level 5

###### Heading level 6

---

*italic*

> Blockquote

1. First item
2. Second item
3. Third item
4. Fourth item

![Images are just not rendered](/assets/images/image.png)
`;

export default function MarkdownPlaygroundPage() {
  return <MarkdownPage title="Markdown Playground" source={source} />;
}
