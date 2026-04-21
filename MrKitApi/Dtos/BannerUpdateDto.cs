    // Dtos/BannerDto.cs
    using System.ComponentModel.DataAnnotations;

    namespace MrKitApi.Dtos
    {
    public class BannerUpdateDto : BannerDto
    {
    public IFormFile? File1 { get; set; }
        public IFormFile? File2 { get; set; }
        public IFormFile? File3 { get; set; }
    }
    }