/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { picklist, pipe, string, url } from "valibot";

export const nodeEnvSchema = picklist(["development", "production"]);

export const environmentTypeSchema = picklist(["local", "dev", "production"]);

export const deploymentTypeSchema = picklist(["test", "production"]);

export const urlSchema = pipe(string(), url());
