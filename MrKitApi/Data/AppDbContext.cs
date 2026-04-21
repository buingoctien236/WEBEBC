using Microsoft.EntityFrameworkCore;
using MrKitApi.Models;

namespace MrKitApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
public DbSet<AdminLog> AdminLogs { get; set; }  
        public DbSet<Product> Products { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Spotlight> SpotlightProducts { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<FlashSale> FlashSales { get; set; }
        public DbSet<FlashSaleProduct> FlashSaleProducts { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                // Tên bảng
                entity.ToTable("products");

                // Khóa chính - tự động tăng
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedOnAdd(); // AUTO_INCREMENT

                // Tên sản phẩm
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("name")
                    .HasComment("Tên sản phẩm");

                // Mô tả ngắn
                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasComment("Mô tả ngắn về sản phẩm");

                // Thông số chi tiết
                entity.Property(e => e.DetailedSpecs)
                    .HasColumnName("detailed_specs")
                    .HasComment("Thông số kỹ thuật chi tiết");

                // Giá gốc
                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasColumnType("decimal(10,2)")
                    .HasColumnName("price")
                    .HasComment("Giá gốc của sản phẩm")
                    .HasDefaultValue(0.00m);

                // Giá sale (có thể null)
                entity.Property(e => e.SalePrice)
                    .HasColumnType("decimal(10,2)")
                    .HasColumnName("sale_price")
                    .HasComment("Giá khuyến mãi (nếu có)")
                    .IsRequired(false);

                // Trạng thái (sale/not_sale)
                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("status")
                    .HasConversion(
                        v => v.ToString(),
                        v => v)
                    .HasComment("Trạng thái: 'sale' hoặc 'not_sale'")
                    .HasDefaultValue("not_sale");



                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("category")
                    .HasConversion(
                        v => v.ToString(),
                        v => v)

                    .HasDefaultValue("Chất tẩy rửa");



                // Danh sách ảnh (JSON array)
                entity.Property(e => e.Images)
                    .HasColumnName("images")
                    .HasConversion(
                        v => v == null || v == "[]" ? "[]" : v,
                        v => v)
                    .HasComment("Danh sách URL ảnh sản phẩm (JSON array)")
                    .HasDefaultValue("[]");

                // Thời gian tạo
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .HasComment("Thời gian tạo sản phẩm");

                // Thời gian cập nhật
                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
                    .HasComment("Thời gian cập nhật cuối");

                // Indexes cho hiệu suất query
                entity.HasIndex(e => e.Status)
                    .HasDatabaseName("idx_products_status");

                entity.HasIndex(e => e.Category)
                    .HasDatabaseName("idx_products_category");

                entity.HasIndex(e => e.CreatedAt)
                    .HasDatabaseName("idx_products_created_at");

                entity.HasIndex(e => new { e.Status, e.Category })
                    .HasDatabaseName("idx_products_status_category");


            });
            modelBuilder.Entity<Spotlight>(entity =>
   {
       entity.ToTable("spotlight_products");

       // Không có khóa chính
       entity.HasKey(e => e.Id);

       entity.Property(e => e.Id)
           .HasColumnName("id")
           .ValueGeneratedOnAdd();

       entity.Property(e => e.Idsp1)
           .HasColumnName("idsp1");

       entity.Property(e => e.Idsp2)
           .HasColumnName("idsp2");

       entity.Property(e => e.Idsp3)
           .HasColumnName("idsp3");

       entity.Property(e => e.Idsp4)
           .HasColumnName("idsp4");

       entity.Property(e => e.Idsp5)
           .HasColumnName("idsp5");

       entity.Property(e => e.Idsp6)
           .HasColumnName("idsp6");
   });
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Product &&
                    (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (Product)entry.Entity;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }

                entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}