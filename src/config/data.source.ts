import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import  InitSeeder  from '../../db/seeds/init.seeder';
import { SeederOptions } from 'typeorm-extension';

ConfigModule.forRoot({
    envFilePath: `.env`,
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {

    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: true,
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
};

const options = {

    ...DataSourceConfig,
    seeds: [InitSeeder],
}


export const AppDS = new DataSource(options as DataSourceOptions & SeederOptions);
