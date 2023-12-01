# Enumerable Extension SetZeroPadding

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application1.Extensions
{
    public static class Enumerable
    {
        /// <summary>
        /// Returns a new string that right-aligns the characters in this instance by padding 
        /// them on the left with a leading zero, for a specified total length.
        /// </summary>
        /// <typeparam name="TSource">string type</typeparam>
        /// <param name="source"></param>
        /// <param name="totalWidth">The number of characters in the resulting string, equal to the number of original 
        /// characters plus any additional padding characters.</param>
        /// <returns></returns>
        /// <example>
        /// // PoleNumber is a IEnumerable list of string
        /// address.PoleNumbers = address.PoleNumbers.SetZeroPadding(3);
        /// </example>
        public static IEnumerable<TSource> SetZeroPadding<TSource>(this IEnumerable<TSource> source, int totalWidth)
        {
            if (typeof(TSource) == typeof(string))
            {
                var list = new List<TSource>();

                source
                    .ToList()
                    .ForEach(s =>
                    {
                        string value = (string)Convert.ChangeType(s, typeof(string));
                        if (value.Length < totalWidth)
                        {
                            value = value.PadLeft(totalWidth, '0');

                            TSource t = (TSource)Convert.ChangeType(value, typeof(TSource));
                            list.Add(t);
                        }
                        else
                        {
                            list.Add(s);
                        }
                    });
                return list.AsEnumerable();
            }

            return source;
        }
    }
}
```