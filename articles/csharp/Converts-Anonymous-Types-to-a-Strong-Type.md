# Converts Anonymous Types to a Strong Type

```c#
/// <summary>
/// Converts anonymous types to a strong type
/// https://codeblog.jonskeet.uk/2009/01/09/horrible-grotty-hack-returning-an-anonymous-type-instance/
/// </summary>
/// <typeparam name="T"></typeparam>
/// <param name="target">anonymous types object</param>
/// <param name="example">new { Fruit = "", Topping = "" }</param>
/// <returns></returns>
public static T Cast<T>(object target, T example)
{
	return (T)target;
}
```
