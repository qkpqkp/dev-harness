# Planning Prompt

You are planning a software change. Do not write code yet.

Read the project instructions, task, existing harness context, and relevant files. Produce a concise engineering plan that a coding agent can execute without rediscovering scope.

Required output:

## Goal

State the user-visible outcome.

## Scope

List what will change.

## Non-goals

List nearby work that must not be included.

## Affected Files

List likely files or directories.

## Risks

Call out correctness, compatibility, security, migration, or workflow risks.

## Validation

List the exact tests, lint, typecheck, or manual checks to run.

## Rollback

Explain how to revert or disable the change.

## Assumptions

List assumptions and questions. If an assumption is risky, ask before implementation.
