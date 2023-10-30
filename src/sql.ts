import sql, { ConnectionPool, config as ConnectConfig } from 'mssql';

export class SQL {
  private pool: ConnectionPool;

  public async connect(config: ConnectConfig) {
    this.pool = await sql.connect(config);
    return this.pool;
  }

  public getPool(): ConnectionPool {
    return this.pool;
  }
}
