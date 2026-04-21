using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MrKitApi.Dtos
{public class ContactDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Message { get; set; }
}
}