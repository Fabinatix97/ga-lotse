#!/bin/bash
# Copyright 2024 cronn GmbH
# SPDX-License-Identifier: Apache-2.0


echo "Generating homeserver config..."
python /generate-homeserver-config.py

echo "Starting synapse..."
python /start.py
