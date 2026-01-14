#!/bin/bash
# Copyright 2026 cronn GmbH
# SPDX-License-Identifier: Apache-2.0


python /generate-homeserver-config.py
if [ $? -ne 0 ]; then
  echo "Failed to generate homeserver config. Exiting."
  exit 1
fi

echo "Starting synapse..."
python /start.py
