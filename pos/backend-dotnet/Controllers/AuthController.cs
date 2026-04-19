using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PosBackend.Dotnet;

namespace PosBackend.Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public record SignupDto(string Username, string Email, string Password);
    public record LoginDto(string Email, string Password);

    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Pwd { get; set; } = string.Empty;
    }

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    private string GenerateJwt(int userId, string username, string email)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Secret"] ?? "your-super-secret-key-change-this-in-production-12345"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Email, email)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "pos-cafe",
            audience: _config["Jwt:Audience"] ?? "pos-cafe-users",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupDto? dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.Username) || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return BadRequest(new { error = "All fields are required" });

        var existing = await Database.QueryAsync<dynamic>("SELECT * FROM user WHERE email = @Email", new { Email = dto.Email });
        if (existing.Any()) return BadRequest(new { error = "Email already in use" });

        var sql = "INSERT INTO user (username, email, pwd) VALUES (@Username, @Email, @Password)";
        await Database.ExecuteAsync(sql, dto);

        var user = await Database.QuerySingleOrDefaultAsync<UserDto>(
            "SELECT id as Id, username as Username, email as Email FROM user WHERE email = @Email", 
            new { Email = dto.Email });

        if (user == null) return StatusCode(500, new { error = "User creation failed" });

        var token = GenerateJwt(user.Id, user.Username, user.Email);
        return Created("/api/auth/signup", new { message = "User created", token, user = new { id = user.Id, username = user.Username, email = user.Email } });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto? dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return BadRequest(new { error = "Email and password required" });

        var user = await Database.QuerySingleOrDefaultAsync<UserDto>(
            "SELECT id as Id, username as Username, email as Email, pwd as Pwd FROM user WHERE email = @Email",
            new { Email = dto.Email });

        if (user == null || user.Pwd != dto.Password)
            return Unauthorized(new { error = "Invalid credentials" });

        var token = GenerateJwt(user.Id, user.Username, user.Email);
        return Ok(new { message = "Login successful", token, user = new { id = user.Id, username = user.Username, email = user.Email } });
    }
}
