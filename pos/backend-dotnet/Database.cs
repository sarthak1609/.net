using System.Data;
using Dapper;
using MySqlConnector;

namespace PosBackend.Dotnet
{
    public static class Database
    {
        private static string ConnectionString =>
            Environment.GetEnvironmentVariable("DB_CONNECTION")
            ?? "Server=localhost;User ID=root;Password=Sarthak@16;Database=cafe;";

        public static IDbConnection GetConnection()
        {
            var conn = new MySqlConnection(ConnectionString);
            return conn;
        }

        public static async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<T>(sql, param);
        }

        public static async Task<int> ExecuteAsync(string sql, object? param = null)
        {
            using var conn = GetConnection();
            return await conn.ExecuteAsync(sql, param);
        }

        public static async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? param = null)
        {
            using var conn = GetConnection();
            return await conn.QuerySingleOrDefaultAsync<T>(sql, param);
        }
    }
}
