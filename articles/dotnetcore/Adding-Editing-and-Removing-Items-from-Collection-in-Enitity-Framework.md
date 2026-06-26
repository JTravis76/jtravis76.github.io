Adding, Editing, and Removing Items from Collection in Enitity Framework

```c#
public async Task<EquipmentConfiguration> SaveEquipmentConfigurationAsync(EquipmentConfiguration configuration, AuthModel auth)
{
    bool isAdded = false;
    EquipmentConfiguration existingConfig = null;

    configuration.Name ??= String.Format("Config-{0}", DateTime.UtcNow.ToString());

    if (configuration.Id == 0)
    {
        isAdded = true;

        configuration.PublishedStatus = PublishStatus.Draft;
        configuration.ModifiedUser = auth.DisplayName;
        configuration.IsLocked = true;

        configuration.ConfigurationRatings?.ForEach(x =>
        {
            x.Id = 0;
            x.EquipmentConfigurationId = 0;
            x.CreatedDttm = DateTime.UtcNow;
            x.ModifiedDttm = DateTime.UtcNow;
            x.ModifiedUser = auth.DisplayName;
        });

        _dataContext.Add(configuration);
    }
    else
    {
        var config = _dataContext.EquipmentConfigurations
            .Include(x => x.ConfigurationRatings)
            .FirstOrDefault(x => x.Id == configuration.Id);

        if (config != null)
        {
            existingConfig = config.Clone();

            config.Name = configuration.Name;
            config.Description = configuration.Description;
            config.ModifiedUser = auth.DisplayName;
            config.IsLocked = configuration.IsLocked;

            var addRatingList = new List<ConfigurationRating>();
            configuration.ConfigurationRatings?.ForEach(x =>
            {
                if (x.Id == 0)
                {
                    x.EquipmentConfigurationId = config.Id;
                    x.CreatedDttm = DateTime.UtcNow;
                    x.ModifiedDttm = DateTime.UtcNow;
                    x.ModifiedUser = auth.DisplayName;

                    addRatingList.Add(x);
                }
                else
                {
                    // Find the original and update the properties
                    var rating = config.ConfigurationRatings.FirstOrDefault(y => y.Id == x.Id);
                    if (rating != null)
                    {
                        rating.Type = x.Type;
                        rating.TimeOfDay = x.TimeOfDay;
                        rating.Temp = x.Temp;
                        rating.Unit = x.Unit;
                        rating.Rating = x.Rating;
                        rating.ModifiedDttm = DateTime.UtcNow;
                        rating.ModifiedUser = auth.DisplayName;

                        _dataContext.Update(rating);
                    }
                }
            });

            //== clean up items that were removed
            List<int> ids = configuration.ConfigurationRatings
                .Select(x => x.Id)
                .ToList();
            
            _dataContext.ConfigurationRatings.RemoveRange(
                _dataContext.ConfigurationRatings
                    .Where(x => x.EquipmentConfigurationId == config.Id && !ids.Contains(x.Id))
                );

            //== add and update
            _dataContext.AddRange(addRatingList);
            _dataContext.Update(config);
            configuration = config; // copy back to be returned
        }
    }

    await _dataContext.SaveChangesAsync();

    return await Task.Run(() => configuration);
}
```


```c#
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FacilityRatings.Api.Entities;

[Table("EquipmentConfiguration", Schema = "dbo")]
public class EquipmentConfiguration : AbstractApproval
{
    [JsonPropertyName("id")]
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column(TypeName = "INT")]
    public int Id { get; set; }

    /// <summary>
    /// Id of the configuration that was copied from
    /// </summary>
    [JsonPropertyName("copiedFromConfigurationId")]
    [Column(TypeName = "INT")]
    public int? CopiedFromConfigurationId { get; set; }

    /// <summary>
    /// Id of the original configuration. 
    /// Should ONLY be populated when a change is submitted AFTER the Published status = "Published"
    /// </summary>
    [JsonPropertyName("replacedConfigId")]
    [Column(TypeName = "INT")]
    public int? ReplacedConfigId { get; set; }

    /// <summary>
    /// FK to Equipment Definition
    /// </summary>
    [JsonPropertyName("equipmentDefinitionId")]
    [Column(TypeName = "INT")]
    public int EquipmentDefinitionId { get; set; }

    /// <summary>
    /// Name of the configuration
    /// </summary>
    [JsonPropertyName("name")]
    [Required(AllowEmptyStrings = false)]
    [Column(TypeName = "VARCHAR")]
    [StringLength(100)]
    public string Name { get; set; }

    /// <summary>
    /// Description of the configuration
    /// </summary>
    [JsonPropertyName("description")]
    [Column(TypeName = "VARCHAR")]
    [StringLength(255)]
    public string Description { get; set; }

    /// <summary>
    /// Comment of the configuration review.
    /// This will get set if there is a rejected comment to be displayed on the dashboard.
    /// </summary>
    [JsonPropertyName("comment")]
    [Column(TypeName = "VARCHAR")]
    [StringLength(4000)]
    public string Comment { get; set; }

    [JsonPropertyName("isLocked")]
    [Column(TypeName = "BIT")]
    public bool IsLocked { get; set; }





    [JsonPropertyName("equipmentDefinition")]
    [ForeignKey(nameof(EquipmentDefinitionId))]
    public virtual EquipmentDefinition EquipmentDefinition { get; set; }

    [JsonPropertyName("configurationRatings")]
    public virtual ICollection<ConfigurationRating> ConfigurationRatings { get; set; }

    [JsonPropertyName("equipmentInstances")]
    public virtual ICollection<EquipmentInstance> EquipmentInstances { get; set; }
}
```