using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PosBackend.Dotnet;

var builder = WebApplication.CreateBuilder(args);

// Configure URLs
builder.WebHost.UseUrls("http://localhost:5000");

// Add services
builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Secret"] ?? "your-super-secret-key-change-this-in-production-12345";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "pos-cafe",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "pos-cafe-users",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

var app = builder.Build();
app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));

// Simple endpoints mirroring the existing Node API
app.MapGet("/api/items", async () =>
{
    var rows = await Database.QueryAsync<dynamic>("SELECT * FROM items");
    return Results.Ok(rows);
});

app.MapGet("/api/tables", async () =>
{
    var rows = await Database.QueryAsync<dynamic>("SELECT * FROM tables");
    return Results.Ok(rows);
});

app.MapPost("/api/tables", async (HttpRequest req) =>
{
    var data = await req.ReadFromJsonAsync<TablesCreate>();
    if (data == null || string.IsNullOrEmpty(data.Floor) || data.Capacity == 0)
        return Results.BadRequest(new { error = "floor name and capacity are required" });

    var sql = "INSERT INTO tables (floor, capacity) VALUES (@Floor, @Capacity)";
    var id = await Database.ExecuteAsync(sql, data);
    return Results.Created("/api/tables", new { message = "Table added successfully", product = data });
});

app.MapPut("/api/tables/{id}", async (int id, HttpRequest req) =>
{
    using (var reader = new System.IO.StreamReader(req.Body))
    {
        var json = await reader.ReadToEndAsync();
        var doc = System.Text.Json.JsonDocument.Parse(json);
        var root = doc.RootElement;

        if (!root.TryGetProperty("floor", out var floorElement) || !root.TryGetProperty("capacity", out var capacityElement))
            return Results.BadRequest(new { error = "floor and capacity are required" });

        var floor = floorElement.GetInt32();
        var capacity = capacityElement.GetInt32();

        var sql = "UPDATE tables SET floor = @Floor, capacity = @Capacity WHERE id = @Id";
        var affected = await Database.ExecuteAsync(sql, new { Id = id, Floor = floor, Capacity = capacity });

        if (affected == 0) return Results.NotFound(new { error = "Table not found" });
        return Results.Ok(new { message = "Table updated successfully" });
    }
});

app.MapDelete("/api/tables/{id}", async (int id) =>
{
    var sql = "DELETE FROM tables WHERE id = @Id";
    var affected = await Database.ExecuteAsync(sql, new { Id = id });
    if (affected == 0) return Results.NotFound(new { error = "Table not found" });
    return Results.Ok(new { message = "Table deleted successfully" });
});

app.MapPost("/api/tables/batch", async (HttpRequest req) =>
{
    var data = await req.ReadFromJsonAsync<List<dynamic>>();
    if (data == null || data.Count == 0)
        return Results.BadRequest(new { error = "No tables provided" });

    try
    {
        foreach (var table in data)
        {
            var id = Convert.ToInt32(table.id);
            var sql = "UPDATE tables SET floor = @Floor, capacity = @Capacity WHERE id = @Id";
            var parameters = new
            {
                Id = id,
                Floor = Convert.ToInt32(table.floor),
                Capacity = Convert.ToInt32(table.capacity)
            };
            await Database.ExecuteAsync(sql, parameters);
        }
        return Results.Ok(new { message = "Tables updated successfully" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapGet("/api/category", async () =>
{
    var rows = await Database.QueryAsync<dynamic>("SELECT * FROM category");
    return Results.Ok(rows);
});

app.MapPost("/api/category", async (HttpRequest req) =>
{
    var data = await req.ReadFromJsonAsync<CategoryCreate>();
    if (data == null || string.IsNullOrEmpty(data.Name))
        return Results.BadRequest(new { error = "Product name and price are required" });

    var sql = "INSERT INTO category (c_name) VALUES (@Name)";
    var id = await Database.ExecuteAsync(sql, data);
    return Results.Created("/api/category", new { message = "Category added successfully", product = new { data.Name } });
});

app.MapPost("/api/orders", async (HttpRequest req) =>
{
    var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var data = await req.ReadFromJsonAsync<OrderCreate>(options);
    if (data == null)
        return Results.BadRequest();

    var sql = @"INSERT INTO orders (created_at,status, items, total_amount, paying_status, session_id, payment_method)
                 VALUES (@CreatedAt, @Status, @Items, @TotalAmount, @PayingStatus, @SessionId, @PaymentMethod)";

    var parameters = new
    {
        CreatedAt = DateTime.UtcNow,
        Status = data.Status,
        Items = data.Items != null ? System.Text.Json.JsonSerializer.Serialize(data.Items) : null,
        TotalAmount = data.TotalAmount,
        PayingStatus = data.PayingStatus,
        SessionId = data.SessionId,
        PaymentMethod = data.PaymentMethod
    };

    var rows = await Database.ExecuteAsync(sql, parameters);
    return Results.Ok(new { message = "Order placed successfully" });
});

app.MapPost("/api/orders/status", async (HttpRequest req) =>
{
    var data = await req.ReadFromJsonAsync<OrderStatusUpdate>();
    if (data == null || data.Id == 0 || string.IsNullOrEmpty(data.Status))
        return Results.BadRequest(new { error = "Order ID and status are required" });

    var sql = "UPDATE orders SET status = @Status WHERE id = @Id";
    var affected = await Database.ExecuteAsync(sql, data);
    if (affected == 0) return Results.NotFound(new { error = "Order not found" });
    return Results.Ok(new { message = "Status updated successfully", orderId = data.Id });
});

app.MapPost("/api/orders/update", async (HttpRequest req) =>
{
    var data = await req.ReadFromJsonAsync<OrderPaymentUpdate>();
    if (data == null || data.Id == 0 || string.IsNullOrEmpty(data.PayingStatus))
        return Results.BadRequest(new { error = "Order ID and payment method are required" });

    var sql = "UPDATE orders SET paying_status = @PayingStatus WHERE id = @Id";
    var affected = await Database.ExecuteAsync(sql, data);
    if (affected == 0) return Results.NotFound(new { error = "Order not found" });
    return Results.Ok(new { message = "Payment method updated successfully", orderId = data.Id });
});

app.MapGet("/api/payments", async () =>
{
    var rows = await Database.QueryAsync<dynamic>("SELECT id, payment_method, created_at, total_amount FROM orders;");
    return Results.Ok(rows);
});

app.MapGet("/api/user", async () =>
{
    var rows = await Database.QueryAsync<dynamic>("SELECT * FROM user;");
    return Results.Ok(rows);
});

app.MapGet("/api/orders", async () =>
{
    var rows = await Database.QueryAsync<dynamic>("SELECT * FROM orders;");
    return Results.Ok(rows);
});

app.MapPost("/api/products", async (HttpRequest req) =>
{
    var data = await req.ReadFromJsonAsync<ProductCreate>();
    if (data == null || string.IsNullOrEmpty(data.Name) || data.Price == 0)
        return Results.BadRequest(new { error = "Product name and price are required" });

    var sql = "INSERT INTO items (name, description, price, category) VALUES (@Name, @Description, @Price, @Category)";
    var affected = await Database.ExecuteAsync(sql, data);
    return Results.Created("/api/products", new { message = "Product added successfully", product = data });
});

app.Run();

// DTOs
record TablesCreate(string Floor, int Capacity);
record CategoryCreate(string Name);
record OrderCreate(int Id, string? Status, object? Items, decimal TotalAmount, string? PayingStatus, int? SessionId, string? PaymentMethod);
record OrderStatusUpdate(int Id, string Status);
record OrderPaymentUpdate(int Id, string PayingStatus);
record ProductCreate(string Name, string? Description, decimal Price, string? Category);
