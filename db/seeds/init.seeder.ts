import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class InitSeeder implements Seeder {

    public async run(

      dataSource: DataSource,
      factoryManager: SeederFactoryManager,

    ): Promise<any> {

      await runSeeders(dataSource, {

        seeds: [],

      });
    }
  }
