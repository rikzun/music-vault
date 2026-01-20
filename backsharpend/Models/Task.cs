using System.ComponentModel.DataAnnotations;

public class Task
{
  public int Id { get; set; }

  [Required]
  public string text { get; set; } = string.Empty;
}