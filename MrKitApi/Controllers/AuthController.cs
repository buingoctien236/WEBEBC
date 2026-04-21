// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrKitApi.Data;
using MrKitApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Model cho login request
        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // POST: api/admin/login
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Kiểm tra input
                if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { 
                        success = false, 
                        message = "Vui lòng nhập username và password" 
                    });
                }

                // Tìm admin trong database
                var admin = await _context.Admins
                    .FirstOrDefaultAsync(a => a.Username == request.Username);

                if (admin == null)
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Sai tên đăng nhập hoặc mật khẩu" 
                    });
                }

                // Kiểm tra password
                if (admin.Password != request.Password)
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Sai tên đăng nhập hoặc mật khẩu" 
                    });
                }

                // Tạo JWT token
                var token = GenerateJwtToken(admin.Username, admin.Id);

                // Trả về thông tin đăng nhập thành công
                return Ok(new
                {
                    success = true,
                    message = "Đăng nhập thành công",
                    token,
                    admin = new
                    {
                        id = admin.Id,
                        username = admin.Username
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = $"Lỗi server: {ex.Message}" 
                });
            }
        }

        private string GenerateJwtToken(string username, int adminId)
        {
            var secretKey = _configuration["Jwt:Key"] ?? "your-super-secret-key-at-least-32-chars";
            var issuer = _configuration["Jwt:Issuer"] ?? "MrKitApi";
            var audience = _configuration["Jwt:Audience"] ?? "MrKitAdmin";
            
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.NameIdentifier, adminId.ToString()),
                new Claim("adminId", adminId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(30), // Token có hiệu lực 30'
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // POST: api/admin/validate
        [HttpPost("validate")]
        public ActionResult ValidateToken([FromBody] TokenRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token))
                {
                    return Ok(new { valid = false, message = "Token không hợp lệ" });
                }

                var secretKey = _configuration["Jwt:Key"] ?? "your-super-secret-key-at-least-32-chars";
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(secretKey);

                tokenHandler.ValidateToken(request.Token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"] ?? "MrKitApi",
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"] ?? "MrKitAdmin",
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var username = jwtToken.Claims.First(x => x.Type == ClaimTypes.Name).Value;
                var adminId = jwtToken.Claims.First(x => x.Type == "adminId").Value;

                return Ok(new
                {
                    valid = true,
                    username,
                    adminId
                });
            }
            catch
            {
                return Ok(new { valid = false, message = "Token không hợp lệ hoặc đã hết hạn" });
            }
        }

        public class TokenRequest
        {
            public string Token { get; set; } = string.Empty;
        }
    }
}