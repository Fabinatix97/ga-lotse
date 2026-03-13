# User flow metrics

This library provides a consistent way to track the start and end of a user
flow for example in the citizen portal.

The goal is to analyse how long an activity of a user is and also to see how
many users do not finish a certain user flow (for example changing an appointment).

At the start of a user flow a database entry with a UUID is persisted with the
start time and name of the flow. At the end of the flow the duration is stored.

The UUID is provided to the frontend to be used at the end of the flow.

## Quick start
