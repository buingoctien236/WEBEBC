using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MrKitApi.Dtos;
using System.Net;
using System.Net.Mail;

namespace MrKitApi.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly IConfiguration _config;

        public OrderController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("send-mail")]
        public IActionResult SendMail([FromBody] OrderMailDto dto)
        {
            if (dto == null)
                return BadRequest("Body is null");

            if (string.IsNullOrWhiteSpace(dto.FullName) ||
                string.IsNullOrWhiteSpace(dto.Phone))
                return BadRequest("Thiếu thông tin khách hàng");

            var smtpSection = _config.GetSection("Smtp");

            var fromEmail = smtpSection["Email"];
            var passkey = smtpSection["Passkey"];
            var host = smtpSection["Host"];
           var port = smtpSection.GetValue<int>("Port");


            if (string.IsNullOrWhiteSpace(fromEmail) ||
                string.IsNullOrWhiteSpace(passkey))
                return StatusCode(500, "SMTP config missing");

            if (string.IsNullOrWhiteSpace(dto.Email))
                dto.Email = fromEmail;

            try
            {
                var body = BuildMailBody(dto);

                var mail = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = "XÁC NHẬN ĐƠN HÀNG",
                    Body = body,
                    IsBodyHtml = true
                };

                mail.To.Add(dto.Email);

                var smtp = new SmtpClient(host, port)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(fromEmail, passkey)
                };

                smtp.Send(mail);

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new
                {
                    message = "Gửi mail thất bại",
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        private string BuildMailBody(OrderMailDto dto)
        {
            var html = $@"
                <h2>Thông tin đơn hàng</h2>
                <p><b>Họ tên:</b> {dto.FullName}</p>
                <p><b>SĐT:</b> {dto.Phone}</p>
                <p><b>Email:</b> {dto.Email}</p>

                <table border='1' cellpadding='6' cellspacing='0'>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>";

            foreach (var item in dto.Items)
            {
                html += $@"
                    <tr>
                        <td>{item.ProductName}</td>
                        <td>{item.Quantity}</td>
                        <td>{item.Price:N0} đ</td>
                    </tr>";
            }

            html += $@"
                </table>
                <h3>Tổng tiền: {dto.Total:N0} đ</h3>";

            return html;
        }
    }
}
