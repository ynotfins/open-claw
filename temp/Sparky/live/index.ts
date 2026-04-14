import { runSparky } from "../agent.ts";
import { getRequiredEvidence, isBlockingTaskType } from "../tools.ts";

export async function executeSparky(input: {
  taskType: string;
  payload: Record<string, unknown>;
  context?: Record<string, unknown>;
}) {
  const result = await runSparky(input);
  return {
    ...result,
    requiredEvidence: getRequiredEvidence(input.taskType),
    blockingClass: isBlockingTaskType(input.taskType),
  };
}
