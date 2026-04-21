// Models/Admin.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MrKitApi.Models
{
    [Table("admins")]
    public class Admin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        
        [Required] 
        [Column("username")]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
     
    }
}