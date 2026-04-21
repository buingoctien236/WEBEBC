// Models/FlashSale.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    [Table("flashsales")]
    public class FlashSale
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        
        [Column("description")]
        public string? Description { get; set; }
        
        [Required]
        [Column("start_time")]
        public DateTime StartTime { get; set; }
        
        [Required]
        [Column("end_time")]
        public DateTime EndTime { get; set; }
        
        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "pending"; // pending, active, ended
        
        [Column("is_active")]
        public bool IsActive { get; set; } = false;
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<FlashSaleProduct> FlashSaleProducts { get; set; } = new List<FlashSaleProduct>();
    }
}