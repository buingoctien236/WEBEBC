using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    [Table("admin_logs")]
    public class AdminLog
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("admin_account")]
        public string AdminAccount { get; set; } = string.Empty;

        [Column("log")]
        public string Log { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
