#!/usr/bin/env node

import { dirname, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workflowPath = resolve(projectRoot, "tools", "research-workflow.mjs");

process.env.X_RESEARCH_DIR = process.env.X_RESEARCH_DIR || projectRoot;

await import(pathToFileURL(workflowPath).href);
