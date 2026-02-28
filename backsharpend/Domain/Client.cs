using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Project.Domain;

[Table("client")]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Login), IsUnique = true)]
public class Client
{
    [Key]
    public uint Id { get; set; }

    [Required]
    public string Email { get; set; } = null!;

    [Required]
    public string Login { get; set; } = null!;

    [Required]
    public string PasswordHash { get; set; } = null!;

    public object ToShortData() => new
    {
        Id,
        Email,
        Login
    };
}
