// Models/FlashSaleProduct.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    [Table("flashsale_products")]
    public class FlashSaleProduct
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [Column("flashsale_id")]
        public int FlashSaleId { get; set; }
        
        [Required]
        [Column("product_id")]
        public int ProductId { get; set; }
        
        [Required]
        [Column("flashsale_price", TypeName = "decimal(10,2)")]
        public decimal FlashSalePrice { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("FlashSaleId")]
        public virtual FlashSale? FlashSale { get; set; }
        
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}