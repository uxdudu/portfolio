# Linear Case Narrative Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every portfolio case follow the same reading sequence: challenge, before, during, after.

**Architecture:** Add a small stage-ordering utility and a case layout component that sorts direct sections by narrative stage while preserving order inside each stage. Mark every section in the four existing cases and add explicit “before” context where a case currently lacks it.

**Tech Stack:** React 19, TypeScript, Motion, Node test runner, Vite.

---

### Task 1: Narrative order contract

**Files:**
- Create: `src/caseNarrative.mjs`
- Create: `scripts/case-narrative.test.mjs`
- Modify: `package.json`

- [ ] Write a failing test asserting `intro → challenge → before → during → after → testimonial → next`.
- [ ] Run `npm run test:cases` and verify failure.
- [ ] Implement stable stage ordering.
- [ ] Run `npm run test:cases` and verify success.

### Task 2: Shared case layout

**Files:**
- Modify: `src/CasePages.tsx`

- [ ] Add `CaseNarrativeLayout` using the shared ordering utility.
- [ ] Allow reusable case section components to declare a narrative stage.
- [ ] Preserve existing motion, spacing, and lightbox behavior.

### Task 3: Apply the standard

**Files:**
- Modify: `src/CasePages.tsx`

- [ ] Mark Petrobras Design System sections and move impact/results to “after”.
- [ ] Mark Nossa Energia sections as challenge, before, during, and after.
- [ ] Mark Clinia sections, keeping Version 1 in “before”.
- [ ] Mark Talqui sections and add explicit previous-state context.
- [ ] Keep testimonials after outcomes and before the next case.

### Task 4: Verification

**Files:**
- Test: `scripts/case-narrative.test.mjs`

- [ ] Run `npm run test:cases`.
- [ ] Run `npm run build`.
- [ ] Inspect the four rendered cases in the in-app browser.
- [ ] Confirm section order and console health.
