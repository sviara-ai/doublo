export interface AdService {
  showRewardedAd: () => Promise<boolean>;
}

const localAdService: AdService = {
  showRewardedAd: async () => true,
};

export function getAdService(): AdService {
  return localAdService;
}
