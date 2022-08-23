# Empty MVC Route for Index.html
Sometimes, when working with a SPA framework and a MVC controller, the default route will redirect you to `/Home/Index`.

Use this trick to allow index.html to load instead of a MVC controller route.

```cs
public class RouteConfig
{
    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
        routes.IgnoreRoute(""); //<- to ignore empty routes.

        routes.MapRoute(
            name: "Default",
            url: "{controller}/{action}/{id}",
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            namespaces: new[] { "Application1.Controllers" }
        );
    }
}
```
