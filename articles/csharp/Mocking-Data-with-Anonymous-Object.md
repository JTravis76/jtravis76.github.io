# Mocking Data with Anonymous Object
Sometimes during development, we need to mock up some data on the back-end code to test front-end code. In most cases I use JSON placeholder as mocked data. Other times I like to mock data on the back-end side without creating a bunch of classes.

Below is one option to sent a JSON object by using anonymous objects.

```c#
// Creates a collection of Equipment instances with their
// summer and winter amp ratings
public Task<IActionResult> EquipmentInstanceRatings(int id)
{
  _ = int.TryParse(id, out var circuitId);

  var temperatureRange = new { normal = "", emergency = "", loadDump = "", unit = "" };
  var summerList = Enumerable.Empty<object>()
      .Select(s1 => new { normal = "", emergency = "", loadDump = "", unit = "" })
      .ToList();

  var winterList = Enumerable.Empty<object>()
      .Select(s1 => new { normal = "", emergency = "", loadDump = "", unit = "" })
      .ToList();

  var schema = Enumerable.Empty<object>()
      .Select(s => new { 
          id = 0, 
          circuitGroupId = 0, 
          type = "", 
          model = "", 
          comment = "",
          name = "",
          order = 0,
          summer = summerList,
          winter = winterList,
      })
      .ToList();

  summerList.Add(new { normal = "3000", emergency = "3150", loadDump = "3300", unit = "F" });
  summerList.Add(new { normal = "2000", emergency = "2250", loadDump = "2300", unit = "C" });

  winterList.Add(new { normal = "3000", emergency = "3000", loadDump = "3090", unit = "F" });
  winterList.Add(new { normal = "200", emergency = "225", loadDump = "230", unit = "C" });

  schema.Add(new
  {
      id = 1,
      circuitGroupId = 1,
      type = "Equipment A",
      model = "Model X",
      comment = "",
      name = "Config 1",
      order = 0,
      summer = summerList,
      winter = winterList
  });

  schema.Add(new
  {
      id = 2,
      circuitGroupId = 1,
      type = "Equipment B",
      model = "Model 123",
      comment = "n/a",
      name = "Config 12",
      order = 1,
      summer = summerList,
      winter = winterList
  });

  schema.Add(new
  {
      id = 3,
      circuitGroupId = 1,
      type = "Equipment C",
      model = "Model XYZ",
      comment = "",
      name = "Config 35",
      order = 2,
      summer = summerList,
      winter = winterList
  });

  var data = await Task.Run(() => schema);
  return new JsonResult(data);
}
```