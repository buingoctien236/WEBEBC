namespace MrKitApi.Dtos
{
    public class OrderMailDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new();
        public decimal Total { get; set; }
    }

    public class OrderItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
