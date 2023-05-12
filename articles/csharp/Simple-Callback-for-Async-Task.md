# Simple Callback for Async Task
I thought this was a nice way to return a simple async result while testing.

```csharp
public async Task<Equipment> SaveEquipmentAsync(Equipment equipment)
{
    equipment.Id = 1;
    return await Task.Run(() => equipment);
}
```