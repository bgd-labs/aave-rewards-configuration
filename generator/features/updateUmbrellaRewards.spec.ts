import {expect, describe, it} from 'vitest';
import {MOCK_OPTIONS_UMBRELLA, umbrellaRewardsUpdateConfig} from './mocks/configs';
import {generateFiles} from '../generator';
import {FEATURE, PoolConfigs} from '../types';
import {updateUmbrellaRewards} from './updateUmbrellaRewards';

describe('feature: updateUmbrellaRewards', () => {
  it('should return reasonable code', async () => {
    const output = await updateUmbrellaRewards.build({
      options: MOCK_OPTIONS_UMBRELLA,
      pool: MOCK_OPTIONS_UMBRELLA.pool,
      cfg: umbrellaRewardsUpdateConfig,
      cache: {blockNumber: 42},
    });
    expect(output).toMatchSnapshot();
  });

  it('should properly generate files', async () => {
    const poolConfigs: PoolConfigs = {
      [MOCK_OPTIONS_UMBRELLA.pool]: {
        pool: MOCK_OPTIONS_UMBRELLA.pool,
        artifacts: [
          await updateUmbrellaRewards.build({
            options: MOCK_OPTIONS_UMBRELLA,
            pool: MOCK_OPTIONS_UMBRELLA.pool,
            cfg: umbrellaRewardsUpdateConfig,
            cache: {blockNumber: 42},
          }),
        ],
        configs: {[FEATURE.UPDATE_LM]: umbrellaRewardsUpdateConfig},
        cache: {blockNumber: 42},
      },
    };
    const files = await generateFiles(MOCK_OPTIONS_UMBRELLA, poolConfigs);
    expect(files).toMatchSnapshot();
  });
});
