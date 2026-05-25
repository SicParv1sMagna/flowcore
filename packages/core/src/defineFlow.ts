import {GraphSchema, ValidateTargets} from "./types.js";

export function defineFlow<const Schema extends GraphSchema>(
    schema: Schema & ValidateTargets<Schema>
): Schema { return schema }