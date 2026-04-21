namespace MrKitApi.Models
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string SenderEmail { get; set; } = string.Empty;
        public string ReceiverEmail { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    
    public class ContactDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Message { get; set; }
        public string? Phone { get; set; } // Thêm số điện thoại
    }
}