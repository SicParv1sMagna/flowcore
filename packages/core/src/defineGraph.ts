import {GraphSchema, ValidateTargets} from "./types.js";

export function defineGraph<const Schema extends GraphSchema>(
    schema: Schema & ValidateTargets<Schema>
): Schema { return schema }