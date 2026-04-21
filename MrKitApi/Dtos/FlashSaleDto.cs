// Dtos/FlashSaleDto.cs
using System.ComponentModel.DataAnnotations;

namespace MrKitApi.Dtos
{
    public class CreateFlashSaleDto
    {
        [Required(ErrorMessage = "Tên flash sale là bắt buộc")]
        [MaxLength(200, ErrorMessage = "Tên không quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required(ErrorMessage = "Thời gian bắt đầu là bắt buộc")]
        public DateTime StartTime { get; set; }
        
        [Required(ErrorMessage = "Thời gian kết thúc là bắt buộc")]
        public DateTime EndTime { get; set; }
        
        [Required(ErrorMessage = "Phải có ít nhất 1 sản phẩm")]
        [MinLength(1, ErrorMessage = "Phải có ít nhất 1 sản phẩm")]
        public List<FlashSaleProductDto> Products { get; set; } = new List<FlashSaleProductDto>();
    }

    public class FlashSaleProductDto
    {
        [Required(ErrorMessage = "ProductId là bắt buộc")]
        public int ProductId { get; set; }
        
        [Required(ErrorMessage = "Giá flash sale là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public decimal FlashSalePrice { get; set; }
    }

    public class UpdateFlashSaleDto
    {
        [MaxLength(200, ErrorMessage = "Tên không quá 200 ký tự")]
        public string? Name { get; set; }
        
        public string? Description { get; set; }
        
        public DateTime? StartTime { get; set; }
        
        public DateTime? EndTime { get; set; }
    }
}