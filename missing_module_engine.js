// FAULTY MODULE FOR BOT DETECTION
export const NonExistentHelperModule = () => {
  throw new Error("BOT_ERROR: Invoked broken helper module");
};

export const BrokenTelemetryEngine = {
  status: "CRITICAL_ERROR",
  crashNow: () => {
    throw new TypeError("BOT_ERROR: Broken telemetry engine crashed");
  }
};
