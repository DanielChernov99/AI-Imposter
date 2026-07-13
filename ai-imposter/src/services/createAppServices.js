import { DATA_PROVIDERS } from "./dataProviders.js";

const REQUIRED_SERVICE_METHODS = Object.freeze({
  roomService: [
    "createRoom",
    "joinRoom",
    "setPlayerReady",
    "cancelGameCountdown",
    "leaveRoom",
    "getPlayersByRoomId",
    "startGame",
    "subscribeToRoom",
  ],
  gameService: ["getGameById", "advancePhase", "subscribeToGame"],
  questionService: ["getQuestionById", "getRandomQuestion"],
  answerService: ["submitPlayerAnswer"],
  voteService: ["getVotingAnswers", "submitVote"],
  revealService: ["getRoundResults"],
});

function validateServiceBundle(services, provider) {
  for (const [serviceName, methods] of Object.entries(
    REQUIRED_SERVICE_METHODS,
  )) {
    const service = services?.[serviceName];

    if (!service) {
      throw new Error(
        `${provider} provider did not create required ${serviceName}.`,
      );
    }

    for (const methodName of methods) {
      if (typeof service[methodName] !== "function") {
        throw new Error(
          `${provider} provider ${serviceName} is missing ${methodName}().`,
        );
      }
    }
  }

  return services;
}

export async function createAppServices(provider) {
  let services;

  switch (provider) {
    case DATA_PROVIDERS.MOCK: {
      const { createMockServices } = await import(
        "./mock/createMockServices.js"
      );
      services = createMockServices();
      break;
    }
    case DATA_PROVIDERS.SUPABASE: {
      const { createSupabaseServices } = await import(
        "./supabase/createSupabaseServices.js"
      );
      services = createSupabaseServices();
      break;
    }
    default:
      throw new Error(`Unsupported data provider: ${String(provider)}.`);
  }

  return validateServiceBundle(services, provider);
}

export default createAppServices;
