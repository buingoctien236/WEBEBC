using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    public class Banner
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [MaxLength(500)]
        public string? Banner1 { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Banner2 { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Banner3 { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [NotMapped]
        public List<string> BannersList
        {
            get
            {
                var list = new List<string>();
                if (!string.IsNullOrEmpty(Banner1)) list.Add(Banner1);
                if (!string.IsNullOrEmpty(Banner2)) list.Add(Banner2);
                if (!string.IsNullOrEmpty(Banner3)) list.Add(Banner3);
                return list;
            }
        }
    }
}