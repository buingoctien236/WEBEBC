using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    [Table("spotlight_products")]
    public class Spotlight
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("idsp1")]
        public int Idsp1 { get; set; }
        
        [Column("idsp2")]
        public int Idsp2 { get; set; }
        
        [Column("idsp3")]
        public int Idsp3 { get; set; }
        
        [Column("idsp4")]
        public int Idsp4 { get; set; }
        
        [Column("idsp5")]
        public int Idsp5 { get; set; }
        
        [Column("idsp6")]
        public int Idsp6 { get; set; }
    }
}