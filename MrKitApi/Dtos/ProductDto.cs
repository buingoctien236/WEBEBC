using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MrKitApi.Dtos
{
    public class ProductDto
    {
        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
        [MaxLength(200, ErrorMessage = "Tên sản phẩm không quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Mô tả sản phẩm là bắt buộc")]
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage = "Thông số chi tiết là bắt buộc")]
        public string DetailedSpecs { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giá sản phẩm là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public decimal Price { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Giá khuyến mãi phải lớn hơn 0")]
        public decimal? SalePrice { get; set; }

        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        [RegularExpression("^(sale|not_sale)$", ErrorMessage = "Trạng thái phải là 'sale' hoặc 'not_sale'")]
        public string Status { get; set; } = "not_sale";

        [Required(ErrorMessage = "Danh mục là bắt buộc")]
        public string Category { get; set; } = "chất tẩy rửa";

       

        public List<IFormFile>? Files { get; set; } = new List<IFormFile>();
    }
}