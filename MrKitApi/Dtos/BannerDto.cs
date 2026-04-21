using System.ComponentModel.DataAnnotations;

namespace MrKitApi.Dtos
{   public class BannerDto
    {
        [MaxLength(500)]
        public string? Banner1 { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Banner2 { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Banner3 { get; set; } = string.Empty;
    }

}