using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    [Table("News")]
    public class News
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? HeaderImg { get; set; }
        public string? HeaderContent { get; set; }
        public string? MainImg { get; set; }
        
        [Required]
        public string MainContent { get; set; } = string.Empty;
        
        public string? FooterImg { get; set; }
        public string? FooterContent { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
       
    }
}