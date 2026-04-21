using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MrKitApi.Dtos;

namespace MrKitApi.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ContactController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendContactMail([FromBody] ContactDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Thiếu thông tin" });
            }

            var smtpEmail = _config["Smtp:Email"];
            var smtpPasskey = _config["Smtp:Passkey"];
            var smtpHost = _config["Smtp:Host"];
            var smtpPort = int.Parse(_config["Smtp:Port"] ?? "587");


            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(smtpEmail));
            email.To.Add(MailboxAddress.Parse("otttien@gmail.com"));
            email.Subject = $"[Liên hệ] {dto.Name}";
            email.Body = new TextPart("html")
            {
                Text = $@"
                    <h3>YÊU CẦU MỚI TỪ WEBSITE</h3>
                    <p><b>Tên Khách hàng:</b> {dto.Name}</p>
                    <p><b>Email:</b> {dto.Email}</p>
                    <p>{dto.Message}</p>
                "
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(smtpEmail, smtpPasskey);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return Ok(new { success = true });
        }
    }
}
