using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MrKitApi.Dtos
{
    public class NewsDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? HeaderImg { get; set; }
        public string? HeaderContent { get; set; }
        public string? MainImg { get; set; }
        
        [Required]
        public string MainContent { get; set; } = string.Empty;
        
        public string? FooterImg { get; set; }
        public string? FooterContent { get; set; }
        
        // For file uploads
        public IFormFile? HeaderImgFile { get; set; }
        public IFormFile? MainImgFile { get; set; }
        public IFormFile? FooterImgFile { get; set; }
    }

    public class NewsUpdateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? HeaderImg { get; set; }
        public string? HeaderContent { get; set; }
        public string? MainImg { get; set; }
        
        [Required]
        public string MainContent { get; set; } = string.Empty;
        
        public string? FooterImg { get; set; }
        public string? FooterContent { get; set; }
        
        // For file uploads
        public IFormFile? HeaderImgFile { get; set; }
        public IFormFile? MainImgFile { get; set; }
        public IFormFile? FooterImgFile { get; set; }
        
        // For image deletion
        public bool DeleteHeaderImg { get; set; } = false;
        public bool DeleteMainImg { get; set; } = false;
        public bool DeleteFooterImg { get; set; } = false;
    }
}