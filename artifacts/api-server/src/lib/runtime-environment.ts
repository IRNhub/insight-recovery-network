export function isProductionRuntime(
  environment: NodeJS.ProcessEnv = process.env,
): boolean {
  return environment.NODE_ENV === "production" || environment.REPLIT_DEPLOYMENT === "1";
}
