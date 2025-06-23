import { defineConfig } from '@mikro-orm/postgresql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { entities } from '../entities';
import { DB_URI } from './settings';

export default defineConfig({
    driver: PostgreSqlDriver,
    clientUrl: DB_URI,
    entities,
    tsNode: true,
});
