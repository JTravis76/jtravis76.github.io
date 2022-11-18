# Explicit Operator
I personally found this a nice way to convert object from one to another over using AutoMapper.

```csharp
using System;

namespace Application1.Api.Models
{
    public class JobExportModel
    {
        public string CheckedInUser { get; set; }

        public string CheckedInDate { get; set; }

        public string CheckedInHours { get; set; }

        public string CheckedInBy { get; set; }

        public string Facility { get; set; }

        public string Circuits { get; set; }

        public bool HighProtection { get; set; }


        public static explicit operator JobExportModel(JobModel jobModel)
        {
            string checkinFullName = String.Join(" / ", jobModel.SubjectIdentity, jobModel.SubjectName);

            DateTime checkinDate = System.Convert.ToDateTime(jobModel.CheckinDttm);
            TimeSpan ts = DateTime.UtcNow - checkinDate;
            double checkedInHours = ts.TotalHours;

            return new JobExportModel()
            {
                CheckedInUser = checkinFullName,
                CheckedInDate = jobModel.CheckinDttm,
                CheckedInHours = checkedInHours.ToString("##.0"),
                CheckedInBy = jobModel.IsCheckInAsSelf ? "self" : checkinFullName,
                Facility = jobModel.Facility?.Name,
                Circuits = jobModel.Facility?.Circuits,
                HighProtection = jobModel.Facility?.HighProtection ?? false,
            };
        }
    }

    public class JobModel
    {
      public string SubjectIdentity { get; set; }
      public string SubjectName { get; set; }
      public string CheckinDttm { get; set; }
      public bool IsCheckInAsSelf { get; set; }

      public virtual Facility Facility { get; set; }
    }

    public class Facility
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Circuits { get; set; }
        public bool HighProtection { get; set; }
    }
}
```
And this is how you would use it.

```csharp
public void Main()
{
  var jobModel = new()
  {
    SubjectIdentity = "first.last@domain.com",
    SubjectName = "FirstName LastName".
    CheckinDttm = "9/13/2022 4:44:43 PM",
    IsCheckInAsSelf = false,
    Facility = new()
    {
      Name = "Facility1",
      Circuits = null,
      HighProtection = true
    }
  };

  // this is where the Explicit Operator magic happens
  var jobExportModel = (JobExportModel)jobModel;
}
```
