using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MrKitApi.Models
{
    [Index(nameof(Status), Name = "idx_products_status")]
    [Index(nameof(Category), Name = "idx_products_category")]
    [Index(nameof(CreatedAt), Name = "idx_products_created_at")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        public string DetailedSpecs { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? SalePrice { get; set; }
        
        [Required]
        [Column(TypeName = "enum('sale','not_sale')")]
        public string Status { get; set; } = "not_sale";
        
        [Required]

        public string Category { get; set; } = "Chất tẩy rửa";
        
     
        public string? Images { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [NotMapped]
        public List<string> ImageList
        {
            get
            {
                if (string.IsNullOrEmpty(Images))
                    return new List<string>();
                
                try
                {
                    // Parse JSON string
                    return System.Text.Json.JsonSerializer.Deserialize<List<string>>(Images) 
                        ?? new List<string>();
                }
                catch
                {
                    return new List<string>();
                }
            }
            set
            {
                Images = value == null || value.Count == 0 
                    ? null 
                    : System.Text.Json.JsonSerializer.Serialize(value);
            }
        }
        
        [NotMapped]
        public string MainImage
        {
            get
            {
                var images = ImageList;
                return images.Count > 0 ? images[0] : string.Empty;
            }
        }
        
        [NotMapped]
        public bool IsOnSale => Status == "sale" && SalePrice.HasValue;
        
        [NotMapped]
        public int DiscountPercent
        {
            get
            {
                if (!IsOnSale || SalePrice == null || Price == 0)
                    return 0;
                
                var discount = (int)((Price - SalePrice.Value) / Price * 100);
                return Math.Max(0, Math.Min(100, discount));
            }
        }
    }
}